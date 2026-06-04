'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

import { AcaoLog } from '@/generated/prisma/enums';
import { requirePermission } from '@/utils/require-permission';
import prisma from '@/lib/prisma';

import type { UsuarioRow } from './equipe-columns';

type UsuarioInput = {
    nome: string;
    usuario: string;
    senha?: string;
    role: 'SUPER_ADMIN' | 'RECEPCAO' | 'EMISSOR';
};

type ActionResult = { success: boolean; message: string };

export const listarUsuarios = async (): Promise<UsuarioRow[]> => {
    await requirePermission(['SUPER_ADMIN']);

    return prisma.usuario.findMany({
        select: { id: true, nome: true, usuario: true, role: true, ativo: true },
        orderBy: { nome: 'asc' },
    });
};

export const criarUsuario = async (input: UsuarioInput): Promise<ActionResult & { id?: string }> => {
    const session = await requirePermission(['SUPER_ADMIN']);

    const existe = await prisma.usuario.findUnique({ where: { usuario: input.usuario } });
    if (existe) return { success: false, message: 'Nome de usuário já está em uso.' };

    const senhaHash = await bcrypt.hash(input.senha!, 12);

    const criado = await prisma.usuario.create({
        data: { nome: input.nome, usuario: input.usuario, senhaHash, role: input.role },
        select: { id: true, usuario: true },
    });

    await prisma.log.create({
        data: {
            usuarioNome: session.nome,
            usuarioLogin: session.usuario,
            acao: AcaoLog.USUARIO_CRIADO,
            detalhes: `Usuário ${criado.usuario} (${input.role}) criado.`,
            usuarioId: session.id,
        },
    });

    revalidatePath('/equipe');
    return { success: true, message: 'Usuário criado com sucesso.', id: criado.id };
};

export const editarUsuario = async (id: string, input: UsuarioInput): Promise<ActionResult> => {
    const session = await requirePermission(['SUPER_ADMIN']);

    const duplicado = await prisma.usuario.findFirst({
        where: { usuario: input.usuario, NOT: { id } },
    });
    if (duplicado) return { success: false, message: 'Nome de usuário já está em uso.' };

    const data: Record<string, unknown> = {
        nome: input.nome,
        usuario: input.usuario,
        role: input.role,
    };

    if (input.senha && input.senha.length >= 6) {
        data.senhaHash = await bcrypt.hash(input.senha, 12);
    }

    await prisma.usuario.update({ where: { id }, data });

    await prisma.log.create({
        data: {
            usuarioNome: session.nome,
            usuarioLogin: session.usuario,
            acao: AcaoLog.USUARIO_EDITADO,
            detalhes: `Usuário ${input.usuario} (${input.role}) atualizado.`,
            usuarioId: session.id,
        },
    });

    revalidatePath('/equipe');
    return { success: true, message: 'Usuário atualizado com sucesso.' };
};

export const toggleAtivo = async (id: string, ativo: boolean): Promise<ActionResult> => {
    const session = await requirePermission(['SUPER_ADMIN']);

    if (id === session.id) {
        return { success: false, message: 'Você não pode desativar sua própria conta.' };
    }

    const usuario = await prisma.usuario.update({
        where: { id },
        data: { ativo },
        select: { usuario: true },
    });

    await prisma.log.create({
        data: {
            usuarioNome: session.nome,
            usuarioLogin: session.usuario,
            acao: AcaoLog.USUARIO_DESATIVADO,
            detalhes: `Usuário ${usuario.usuario} ${ativo ? 'ativado' : 'desativado'}.`,
            usuarioId: session.id,
        },
    });

    revalidatePath('/equipe');
    return { success: true, message: `Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso.` };
};
