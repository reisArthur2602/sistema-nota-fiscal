'use server';

import fs from 'fs/promises';
import path from 'path';

import { PER_PAGE } from '@/constants';
import { downloadFileFtp, uploadFileFtp, type FtpConnectionConfig } from '@/lib/ftp';
import prisma from '@/lib/prisma';
import { sendZapiMessage } from '@/lib/zapi';
import { getSession } from '@/utils/session';

export const listExamesAction = async (params: {
    search?: string;
    status?: string;
    page?: number;
}) => {
    const session = await getSession();
    if (!session) throw new Error('Não autorizado.');

    const { search, status, page = 1 } = params;

    const where = {
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

    const buffer = Buffer.from(await arquivo.arrayBuffer());
    const filename = `${protocolo}_${Date.now()}.pdf`;

    /* ── FTP ─────────────────────────────────────── */
    const ftpRow = await prisma.configuracao.findUnique({ where: { chave: 'ftp' } });
    const ftpConfig = ftpRow?.valor as {
        host: string;
        porta: number;
        usuario: string;
        senha: string;
        caminho: string;
        ativo: boolean;
    } | null;

    let caminhoArquivo: string;
    let fonte: string;

    if (ftpConfig?.ativo && ftpConfig.host) {
        const ftpConn: FtpConnectionConfig = {
            host: ftpConfig.host,
            porta: ftpConfig.porta,
            usuario: ftpConfig.usuario,
            senha: ftpConfig.senha,
            caminho: ftpConfig.caminho,
        };
        const upload = await uploadFileFtp(ftpConn, buffer, filename);
        if (!upload.success) {
            return { success: false, message: `Falha ao enviar para o FTP: ${upload.message}` } as const;
        }
        caminhoArquivo = upload.remotePath;
        fonte = 'ftp';
    } else {
        const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        caminhoArquivo = filename;
        fonte = 'local';
    }

    /* ── Banco de dados ──────────────────────────── */
    await prisma.exame.create({
        data: {
            cpf,
            nomePaciente,
            telefone,
            protocolo,
            caminhoArquivo,
            fonte,
            criadoPorId: session.id,
        },
    });

    await prisma.log.create({
        data: {
            tipo: 'UPLOAD_EXAME',
            usuarioId: session.id,
            detalhes: { cpf, nomePaciente, protocolo, fonte },
        },
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';
    const link = `${baseUrl}/exame?c=${cpf}&p=${protocolo}`;

    /* ── Z-API ───────────────────────────────────── */
    let whatsappEnviado = false;
    if (telefone) {
        const zapiRow = await prisma.configuracao.findUnique({ where: { chave: 'zapi' } });
        const zapiConfig = zapiRow?.valor as {
            instanceId: string;
            token: string;
            mensagem: string;
            ativo: boolean;
        } | null;

        if (zapiConfig?.ativo && zapiConfig.instanceId && zapiConfig.token) {
            const mensagem = zapiConfig.mensagem
                .replace('{nome}', nomePaciente.split(' ')[0])
                .replace('{protocolo}', protocolo)
                .replace('{link}', link);

            const result = await sendZapiMessage(zapiConfig.instanceId, zapiConfig.token, telefone, mensagem);
            whatsappEnviado = result.success;

            await prisma.log.create({
                data: {
                    tipo: 'WHATSAPP_ENVIADO',
                    usuarioId: session.id,
                    detalhes: { protocolo, sucesso: result.success, mensagem: result.message },
                },
            });
        }
    }

    return { success: true, link, nomePaciente, protocolo, whatsappEnviado } as const;
};

export const toggleExameAtivoAction = async (id: string, ativo: boolean) => {
    const session = await getSession();
    if (!session) return { success: false } as const;

    await prisma.exame.update({ where: { id }, data: { ativo } });

    await prisma.log.create({
        data: {
            tipo: ativo ? 'REATIVAR_EXAME' : 'INATIVAR_EXAME',
            usuarioId: session.id,
            detalhes: { exameId: id },
        },
    });

    return { success: true } as const;
};

export const getFileFtpAction = async (remotePath: string): Promise<Buffer | null> => {
    const ftpRow = await prisma.configuracao.findUnique({ where: { chave: 'ftp' } });
    const ftpConfig = ftpRow?.valor as {
        host: string;
        porta: number;
        usuario: string;
        senha: string;
        caminho: string;
        ativo: boolean;
    } | null;

    if (!ftpConfig?.host) return null;

    return downloadFileFtp(
        {
            host: ftpConfig.host,
            porta: ftpConfig.porta,
            usuario: ftpConfig.usuario,
            senha: ftpConfig.senha,
            caminho: ftpConfig.caminho,
        },
        remotePath,
    );
};
