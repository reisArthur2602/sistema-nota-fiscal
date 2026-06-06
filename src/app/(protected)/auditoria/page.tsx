import { type Metadata } from 'next';
import { Suspense } from 'react';

import { requirePermission } from '@/utils/require-permission';

import { AuditoriaContent } from './auditoria-content';
import { AuditoriaTableSkeleton } from './auditoria-table-skeleton';

export const metadata: Metadata = {
    title: 'Auditoria',
};

const AuditoriaPage = async () => {
    await requirePermission(['SUPER_ADMIN']);

    return (
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Auditoria</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Histórico completo de ações realizadas no sistema.
                </p>
            </div>

            <Suspense fallback={<AuditoriaTableSkeleton />}>
                <AuditoriaContent />
            </Suspense>
        </main>
    );
};

export default AuditoriaPage;
