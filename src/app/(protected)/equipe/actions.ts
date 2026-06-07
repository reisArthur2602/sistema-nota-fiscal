'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

import type { Role } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';
import { requirePermission } from '@/utils/require-permission';

export const listarUsuarios = async () => {
    await requirePermission(['SUPER_ADMIN']);
    return prisma.usuario.findMany({
        select: { id: true, nome: true, usuario: true, role: true, ativo: true, criadoEm: true },
        orderBy: { nome: 'asc' },
    });
};

export const criarUsuarioAction = async (input: {
    nome: string;
    usuario: string;
    senha: string;
    role: Role;
}) => {
    const session = await requirePermission(['SUPER_ADMIN']);

    const existe = await prisma.usuario.findUnique({ where: { usuario: input.usuario } });
    if (existe) return { success: false, message: 'Nome de usuário já está em uso.' } as const;

    const senhaHash = await bcrypt.hash(input.senha, 10);
    await prisma.usuario.create({
        data: { nome: input.nome, usuario: input.usuario, senhaHash, role: input.role },
    });

    await prisma.log.create({
        data: {
            tipo: 'CRIAR_USUARIO',
            usuarioId: session.id,
            detalhes: { nome: input.nome, usuario: input.usuario, role: input.role },
        },
    });

    revalidatePath('/equipe');
    return { success: true } as const;
};

export const editarUsuarioAction = async (
    id: string,
    input: { nome: string; usuario: string; role: Role; senha?: string }
) => {
    const session = await requirePermission(['SUPER_ADMIN']);

    const existe = await prisma.usuario.findFirst({
        where: { usuario: input.usuario, NOT: { id } },
    });
    if (existe) return { success: false, message: 'Nome de usuário já está em uso.' } as const;

    const data: Record<string, unknown> = {
        nome: input.nome,
        usuario: input.usuario,
        role: input.role,
    };
    if (input.senha && input.senha.trim()) {
        data.senhaHash = await bcrypt.hash(input.senha, 10);
    }

    await prisma.usuario.update({ where: { id }, data });

    await prisma.log.create({
        data: {
            tipo: 'EDITAR_USUARIO',
            usuarioId: session.id,
            detalhes: { nome: input.nome, usuario: input.usuario, role: input.role },
        },
    });

    revalidatePath('/equipe');
    return { success: true } as const;
};

export const toggleUsuarioAtivoAction = async (id: string, ativo: boolean) => {
    const session = await requirePermission(['SUPER_ADMIN']);

    if (!ativo && session.id === id) {
        return {
            success: false,
            message: 'Você não pode inativar seu próprio usuário.',
        } as const;
    }

    const usuario = await prisma.usuario.update({ where: { id }, data: { ativo } });

    await prisma.log.create({
        data: {
            tipo: ativo ? 'ATIVAR_USUARIO' : 'INATIVAR_USUARIO',
            usuarioId: session.id,
            detalhes: { nome: usuario.nome },
        },
    });

    revalidatePath('/equipe');
    return { success: true } as const;
};
