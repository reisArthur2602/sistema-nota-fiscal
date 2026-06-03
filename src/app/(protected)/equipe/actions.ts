'use server';

import { mockUsuarios } from '@/lib/mocks';
import { z } from 'zod';

export const listarUsuarios = async () => mockUsuarios;

const usuarioSchema = z.object({
    nome: z.string().min(1),
    usuario: z.string().min(3),
    senha: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'RECEPCAO', 'EMISSOR']),
});

export const criarUsuario = async (
    input: unknown,
): Promise<{ success: boolean; message: string }> => {
    const parsed = usuarioSchema.safeParse(input);
    if (!parsed.success) return { success: false, message: 'Dados invalidos.' };
    return { success: true, message: 'Usuario criado com sucesso.' };
};

export const editarUsuario = async (
    _id: string,
    input: unknown,
): Promise<{ success: boolean; message: string }> => {
    const parsed = usuarioSchema.safeParse(input);
    if (!parsed.success) return { success: false, message: 'Dados invalidos.' };
    return { success: true, message: 'Usuario atualizado com sucesso.' };
};

export const toggleAtivo = async (
    _id: string,
    ativo: boolean,
): Promise<{ success: boolean; message: string }> => {
    const acao = ativo ? 'ativado' : 'desativado';
    return { success: true, message: `Usuario ${acao} com sucesso.` };
};
