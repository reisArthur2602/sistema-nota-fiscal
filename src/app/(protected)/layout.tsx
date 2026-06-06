import { type PropsWithChildren } from 'react';

export const dynamic = 'force-dynamic';

import { requireAuth } from '@/utils/require-auth';

import { Header } from './header';

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
    await requireAuth();

    return (
        <div className="min-h-dvh flex flex-col bg-muted/30">
            <Header />
            {children}
        </div>
    );
};

export default ProtectedLayout;
