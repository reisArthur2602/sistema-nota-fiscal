'use server';

import { AcaoLog } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/utils/require-auth';
import { requirePermission } from '@/utils/require-permission';





type SolicitacaoInput = {
    idRegistro: string;
    data: string;
    nome: string;
    cpf: string;
    endereco: string;
    especialidade: string;
    valor: string;
    email?: string;
    telefone?: string;
};

export const criarSolicitacao = async (
    input: SolicitacaoInput
): Promise<{ success: boolean; message: string }> => {
    const session = await requirePermission(['RECEPCAO', 'SUPER_ADMIN']);

    const criada = await prisma.solicitacao.create({
        data: {
            idRegistro: input.idRegistro,
            nome: input.nome,
            cpf: input.cpf,
            endereco: input.endereco,
            especialidade: input.especialidade,
            valor: input.valor,
            data: new Date(input.data),
            email: input.email ?? '',
            telefone: input.telefone ?? '',
            criadoPorId: session.id,
        },
        select: { id: true, idRegistro: true },
    });

    await prisma.log.create({
        data: {
            usuarioNome: session.nome,
            usuarioLogin: session.usuario,
            acao: AcaoLog.SOLICITACAO_CRIADA,
            detalhes: `Solicitação ${criada.idRegistro} criada.`,
            usuarioId: session.id,
        },
    });

    return { success: true, message: 'Solicitação enviada com sucesso.' };
};

export const listarUltimasSolicitacoes = async () => {
    const session = await requirePermission(['RECEPCAO', 'SUPER_ADMIN']);

    return prisma.solicitacao.findMany({
        where: { criadoPorId: session.id },
        select: {
            id: true,
            idRegistro: true,
            nome: true,
            cpf: true,
            especialidade: true,
            data: true,
            status: true,
        },
        orderBy: { criadoEm: 'desc' },
        take: 5,
    });
};
