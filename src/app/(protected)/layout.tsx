import { PropsWithChildren } from 'react';

import { mockUser } from '@/lib/mocks';
import type { Role } from '@/lib/types';

import { Header } from './header';
import { NotificacaoEmissor } from './notificacao-emissor';
import { Sidebar } from './sidebar';

const ProtectedLayout = ({ children }: PropsWithChildren) => {
    const role = mockUser.role as Role;

    return (
        <div className="flex h-dvh overflow-hidden">
            <Sidebar role={role} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>

            {role === 'EMISSOR' && <NotificacaoEmissor />}
        </div>
    );
};

export default ProtectedLayout;
