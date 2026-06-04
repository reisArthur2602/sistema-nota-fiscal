import { redirect } from 'next/navigation';

import type { Role } from '@/generated/prisma/enums';

import { canPermission } from './can-permission';
import { requireAuth } from './require-auth';
import { type SessionPayload } from './session';

const defaultRoute: Record<Role, string> = {
    RECEPCAO: '/solicitacao',
    EMISSOR: '/emissor',
    SUPER_ADMIN: '/equipe',
};

export const requirePermission = async (allowed: Role[]): Promise<SessionPayload> => {
    const session = await requireAuth();
    if (!canPermission(session.role, allowed)) redirect(defaultRoute[session.role]);
    return session;
};
