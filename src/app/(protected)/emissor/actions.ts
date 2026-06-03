'use server';

import { mockSolicitacoes } from '@/lib/mocks';

export const listarSolicitacoes = async (status?: string) => {
    if (!status) {
        return mockSolicitacoes;
    }
    return mockSolicitacoes.filter((s) => s.status === status);
};

export const contarPendentes = async () => {
    return mockSolicitacoes.filter((s) => s.status === 'PENDENTE').length;
};

export const enviarNota = async (
    _solicitacaoId: string,
    _linkNota: string,
): Promise<{ success: boolean; message: string }> => {
    return { success: true, message: 'Nota fiscal enviada com sucesso!' };
};
