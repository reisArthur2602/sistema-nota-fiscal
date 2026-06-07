'use server';

import { PER_PAGE } from '@/constants';
import { deleteFileFtp, uploadFileFtp, type FtpConnectionConfig } from '@/lib/ftp';
import prisma from '@/lib/prisma';
import { sendZapiMessage } from '@/lib/zapi';
import { getSession } from '@/utils/session';

type FtpStoredConfig = {
    host: string;
    porta: number;
    usuario: string;
    senha: string;
    caminho: string;
    ativo: boolean;
};

const getFtpConfig = async (): Promise<FtpStoredConfig | null> => {
    const row = await prisma.configuracao.findUnique({ where: { chave: 'ftp' } });
    return (row?.valor as FtpStoredConfig | undefined) ?? null;
};

const toFtpConnection = (config: FtpStoredConfig): FtpConnectionConfig => ({
    host: config.host,
    porta: config.porta,
    usuario: config.usuario,
    senha: config.senha,
    caminho: config.caminho,
});

export const listExamesAction = async (params: {
    search?: string;
    status?: string;
    page?: number;
}) => {
    const session = await getSession();
    if (!session) throw new Error('Não autorizado.');

    const { search, status, page = 1 } = params;

    const where = {
        // Perfil LAUDO só enxerga os próprios uploads.
        ...(session.role === 'LAUDO' && { criadoPorId: session.id }),
        ...(search && {
            OR: [
                { nomePaciente: { contains: search, mode: 'insensitive' as const } },
                { cpf: { contains: search } },
                { protocolo: { contains: search, mode: 'insensitive' as const } },
            ],
        }),
        ...(status === 'ativo' && { ativo: true }),
        ...(status === 'inativo' && { ativo: false }),
    };

    const [items, total] = await Promise.all([
        prisma.exame.findMany({
            where,
            skip: (page - 1) * PER_PAGE,
            take: PER_PAGE,
            orderBy: { criadoEm: 'desc' },
            include: { criadoPor: { select: { nome: true } } },
        }),
        prisma.exame.count({ where }),
    ]);

    return { items, total, page, perPage: PER_PAGE };
};

export const createExameAction = async (formData: FormData) => {
    const session = await getSession();
    if (!session) return { success: false, message: 'Não autorizado.' } as const;

    const cpf = (formData.get('cpf') as string).replace(/\D/g, '');
    const nomePaciente = formData.get('nomePaciente') as string;
    const protocolo = (formData.get('protocolo') as string).trim();
    const telefone = ((formData.get('telefone') as string | null) ?? '').replace(/\D/g, '') || null;
    const arquivo = formData.get('arquivo') as File;

    const existing = await prisma.exame.findUnique({ where: { protocolo } });
    if (existing) {
        return { success: false, message: 'Já existe um exame com este protocolo.' } as const;
    }

    /* ── Armazenamento: somente FTP ──────────────────── */
    const ftpConfig = await getFtpConfig();
    if (!ftpConfig?.ativo || !ftpConfig.host) {
        return {
            success: false,
            message:
                'O servidor FTP não está configurado ou está desabilitado. Ative-o em Configurações antes de cadastrar exames.',
        } as const;
    }

    const buffer = Buffer.from(await arquivo.arrayBuffer());
    const filename = `${protocolo}_${Date.now()}.pdf`;

    const upload = await uploadFileFtp(toFtpConnection(ftpConfig), buffer, filename);
    if (!upload.success) {
        return { success: false, message: `Falha ao enviar para o FTP: ${upload.message}` } as const;
    }

    /* ── Banco de dados ──────────────────────────────── */
    await prisma.exame.create({
        data: {
            cpf,
            nomePaciente,
            telefone,
            protocolo,
            caminhoArquivo: upload.remotePath,
            criadoPorId: session.id,
        },
    });

    await prisma.log.create({
        data: {
            tipo: 'UPLOAD_EXAME',
            usuarioId: session.id,
            detalhes: { cpf, nomePaciente, protocolo },
        },
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';
    const link = `${baseUrl}/exame?c=${cpf}&p=${protocolo}`;

    /* ── Z-API ───────────────────────────────────────── */
    let whatsappEnviado = false;
    if (telefone) {
        const zapiRow = await prisma.configuracao.findUnique({ where: { chave: 'zapi' } });
        const zapiConfig = zapiRow?.valor as {
            instanceId: string;
            token: string;
            clientToken: string;
            mensagem: string;
            ativo: boolean;
        } | null;

        if (zapiConfig?.ativo && zapiConfig.instanceId && zapiConfig.token) {
            const mensagem = zapiConfig.mensagem
                .replace('{nome}', nomePaciente.split(' ')[0])
                .replace('{protocolo}', protocolo)
                .replace('{link}', link);

            const result = await sendZapiMessage(
                zapiConfig.instanceId,
                zapiConfig.token,
                zapiConfig.clientToken,
                telefone,
                mensagem,
            );
            whatsappEnviado = result.success;

            await prisma.log.create({
                data: {
                    tipo: 'WHATSAPP_ENVIADO',
                    usuarioId: session.id,
                    detalhes: { protocolo, sucesso: result.success },
                },
            });
        }
    }

    return { success: true, link, nomePaciente, protocolo, whatsappEnviado } as const;
};

export const removerExameAction = async (id: string) => {
    const session = await getSession();
    if (!session) return { success: false, message: 'Não autorizado.' } as const;

    const exame = await prisma.exame.findUnique({ where: { id } });
    if (!exame) return { success: false, message: 'Exame não encontrado.' } as const;

    // Perfil LAUDO só pode remover os próprios uploads.
    if (session.role === 'LAUDO' && exame.criadoPorId !== session.id) {
        return { success: false, message: 'Você não pode remover este exame.' } as const;
    }

    // Remove o arquivo do FTP (não bloqueia a exclusão do registro em caso de falha).
    const ftpConfig = await getFtpConfig();
    if (ftpConfig?.host) {
        try {
            await deleteFileFtp(toFtpConnection(ftpConfig), exame.caminhoArquivo);
        } catch {
            // arquivo já inexistente ou FTP indisponível — segue removendo o registro
        }
    }

    await prisma.exame.delete({ where: { id } });

    await prisma.log.create({
        data: {
            tipo: 'REMOVER_EXAME',
            usuarioId: session.id,
            detalhes: { protocolo: exame.protocolo, nomePaciente: exame.nomePaciente },
        },
    });

    return { success: true } as const;
};
