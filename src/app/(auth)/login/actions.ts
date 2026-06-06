'use server';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import { JWT_EXPIRY, SESSION_COOKIE } from '@/constants';

import type { SessionPayload } from '@/utils/session';
import prisma from '@/lib/prisma';

export const loginAction = async (input: { usuario: string; senha: string }) => {
    const user = await prisma.usuario.findUnique({
        where: { usuario: input.usuario },
    });

    if (!user || !user.ativo) {
        return { success: false, message: 'Usuário ou senha inválidos.' } as const;
    }

    const senhaCorreta = await bcrypt.compare(input.senha, user.senhaHash);

    if (!senhaCorreta) {
        return { success: false, message: 'Usuário ou senha inválidos.' } as const;
    }

    const payload: SessionPayload = {
        id: user.id,
        nome: user.nome,
        usuario: user.usuario,
        role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: JWT_EXPIRY });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
        path: '/',
    });

    return { success: true } as const;
};
