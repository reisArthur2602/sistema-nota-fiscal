import { PropsWithChildren } from 'react';

export const dynamic = 'force-dynamic';

import { OnboardingDialog } from '@/components/onboarding-dialog';

import { requireAuth } from '@/utils/require-auth';
import { Header } from './header';
import { NotificacaoEmissor } from './notificacao-emissor';
import { Sidebar } from './sidebar';

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
    const session = await requireAuth();

    return (
        <div className="flex h-dvh overflow-hidden">
            <Sidebar role={session.role} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header nome={session.nome} usuario={session.usuario} role={session.role} />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>

            {session.role === 'EMISSOR' && <NotificacaoEmissor />}
            <OnboardingDialog userId={session.id} role={session.role} nome={session.nome} />
        </div>
    );
};

export default ProtectedLayout;
