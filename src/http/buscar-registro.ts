'use server';
import { requireAuth } from '@/utils/require-auth';

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
    idRegistro: string
): Promise<{ success: true; data: RespostaRegistro } | { success: false; message: string }> => {
    await requireAuth();

    try {
        const res = await fetch(`${process.env.EXTERNAL_API}/${idRegistro}`, {
            cache: 'no-store',
        });

        if (!res.ok) return { success: false, message: 'Registro não encontrado.' };

        const data: RespostaRegistro = await res.json();
        return { success: true, data };
    } catch {
        return { success: false, message: 'Erro ao buscar registro. Tente novamente.' };
    }
};
