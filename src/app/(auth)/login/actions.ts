'use server';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { JWT_EXPIRY, SESSION_COOKIE } from '@/constants';
import prisma from '@/lib/prisma';
import type { SessionPayload } from '@/utils/session';

type LoginInput = {
    usuario: string;
    senha: string;
};

export const loginAction = async (
    input: LoginInput
): Promise<{ success: false; message: string }> => {
    const user = await prisma.usuario.findUnique({
        where: { usuario: input.usuario },
        select: {
            id: true,
            nome: true,
            usuario: true,
            senhaHash: true,
            role: true,
            ativo: true,
        },
    });

    if (!user || !user.ativo) {
        return { success: false, message: 'Usuário ou senha inválidos.' };
    }

    const senhaCorreta = await bcrypt.compare(input.senha, user.senhaHash);

    if (!senhaCorreta) {
        return { success: false, message: 'Usuário ou senha inválidos.' };
    }

    const payload: SessionPayload = {
        id: user.id,
        nome: user.nome,
        usuario: user.usuario,
        role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: JWT_EXPIRY });

    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
        path: '/',
    });

    const destino =
        user.role === 'EMISSOR'
            ? '/emissor'
            : user.role === 'RECEPCAO'
              ? '/solicitacao'
              : '/equipe';

    redirect(destino);
};
