'use server';

import { revalidatePath } from 'next/cache';

import { AcaoLog, StatusSolicitacao } from '@/generated/prisma/enums';
import { sendMail } from '@/lib/nodemailer';
import prisma from '@/lib/prisma';
import { buildMensagem } from '@/utils/build-message';
import { requireAuth } from '@/utils/require-auth';
import { requirePermission } from '@/utils/require-permission';

export const listarSolicitacoes = async () => {
    await requirePermission(['EMISSOR', 'SUPER_ADMIN']);

    return prisma.solicitacao.findMany({
        include: {
            criadoPor: { select: { nome: true, usuario: true } },
        },
        orderBy: { status: 'asc' },
    });
};

export const contarPendentes = async (): Promise<number> => {
    await requireAuth();

    return prisma.solicitacao.count({
        where: { status: StatusSolicitacao.PENDENTE },
    });
};

export const enviarNota = async (
    solicitacaoId: string,
    linkNota: string
): Promise<{ success: boolean; message: string }> => {
    const session = await requirePermission(['EMISSOR', 'SUPER_ADMIN']);

    const solicitacao = await prisma.solicitacao.findUnique({
        where: { id: solicitacaoId },
    });

    if (!solicitacao) return { success: false, message: 'Solicitação não encontrada.' };

    if (solicitacao.email) {
        const mensagem = buildMensagem(solicitacao, linkNota);

        await sendMail({
            to: solicitacao.email,
            subject: 'Sua nota fiscal está disponível',
            text: mensagem,
            html: mensagem.replace(/\n/g, '<br>'),
        });
    }

    await prisma.solicitacao.update({
        where: { id: solicitacaoId },
        data: { status: StatusSolicitacao.ENVIADA_AO_PACIENTE },
    });

    await prisma.log.create({
        data: {
            usuarioNome: session.nome,
            usuarioLogin: session.usuario,
            acao: AcaoLog.NOTA_ENVIADA,
            detalhes: `Nota fiscal enviada para solicitação ${solicitacao.idRegistro}${solicitacao.email ? ` (${solicitacao.email})` : ' (sem e-mail)'}`,
            usuarioId: session.id,
        },
    });

    revalidatePath('/emissor');
    return { success: true, message: 'Nota fiscal enviada com sucesso!' };
};
