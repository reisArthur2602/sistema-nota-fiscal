import jwt from 'jsonwebtoken';
import { cache } from 'react';
import { cookies } from 'next/headers';

import type { Role } from '@/generated/prisma/enums';

import { SESSION_COOKIE } from '@/constants';

export type SessionPayload = {
    id: string;
    nome: string;
    usuario: string;
    role: Role;
};

export const getSession = cache(async (): Promise<SessionPayload | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return null;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as SessionPayload;
        return payload;
    } catch {
        return null;
    }
});
