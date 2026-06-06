import { type Metadata } from 'next';
import { Suspense } from 'react';

import { requirePermission } from '@/utils/require-permission';

import { ConfiguracoesContent } from './configuracoes-content';
import { ConfiguracoesSkeleton } from './configuracoes-skeleton';

export const metadata: Metadata = {
    title: 'Configurações',
};

const ConfiguracoesPage = async () => {
    await requirePermission(['SUPER_ADMIN']);

    return (
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Gerencie as integrações e preferências do sistema.
                </p>
            </div>

            <Suspense fallback={<ConfiguracoesSkeleton />}>
                <ConfiguracoesContent />
            </Suspense>
        </main>
    );
};

export default ConfiguracoesPage;
