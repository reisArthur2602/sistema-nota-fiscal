'use server';

import { mockRegistro, mockSolicitacoes } from '@/lib/mocks';
import { z } from 'zod';

type RespostaRegistro = {
    data: string;
    nome: string;
    cpf: string;
    endereco: string;
    especialidade: string;
    email?: string;
    telefone?: string;
};

export const buscarRegistro = async (
    idRegistro: string,
): Promise<{ success: true; data: RespostaRegistro } | { success: false; message: string }> => {
    if (idRegistro === mockRegistro.id) {
        return { success: true, data: mockRegistro };
    }

    try {
        const res = await fetch(`${process.env.EXTERNAL_API}/${idRegistro}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return { success: false, message: 'Registro não encontrado.' };
        }

        const data: RespostaRegistro = await res.json();
        return { success: true, data };
    } catch {
        return { success: false, message: 'Erro ao buscar registro. Tente novamente.' };
    }
};

const solicitacaoSchema = z.object({
    idRegistro: z.string().min(1),
    data: z.string().min(1),
    nome: z.string().min(1),
    cpf: z.string().min(1),
    endereco: z.string().min(1),
    especialidade: z.string().min(1),
    valor: z.string().min(1),
    email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
    telefone: z.string().optional(),
});

export const listarUltimasSolicitacoes = async () => {
    return mockSolicitacoes;
};

export const criarSolicitacao = async (
    input: unknown,
): Promise<{ success: boolean; message: string }> => {
    const parsed = solicitacaoSchema.safeParse(input);

    if (!parsed.success) {
        return { success: false, message: 'Dados inválidos. Verifique os campos e tente novamente.' };
    }

    const { data } = parsed;

    // Persiste no mock para que o emissor seja notificado (polling detecta o novo PENDENTE)
    mockSolicitacoes.unshift({
        id: `sol-${Date.now()}`,
        idRegistro: data.idRegistro,
        nome: data.nome,
        cpf: data.cpf,
        endereco: data.endereco,
        especialidade: data.especialidade,
        valor: data.valor,
        data: data.data,
        email: data.email ?? '',
        telefone: data.telefone ?? '',
        status: 'PENDENTE',
    });

    return { success: true, message: 'Solicitação enviada com sucesso.' };
};
