import { redirect } from 'next/navigation';

import { getSession } from '@/utils/session';

export const redirectIfAuthenticated = async () => {
    const session = await getSession();
    if (!session) return;

    const destino =
        session.role === 'EMISSOR'
            ? '/emissor'
            : session.role === 'RECEPCAO'
              ? '/solicitacao'
              : '/equipe';

    redirect(destino);
};
