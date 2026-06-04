import { Suspense } from 'react';
import type { Metadata } from 'next';

import { requirePermission } from '@/utils/require-permission';

import { EmissorContent } from './emissor-content';
import { EmissorTableSkeleton } from './emissor-table-skeleton';

export const metadata: Metadata = {
    title: 'Emissão',
};

const EmissorPage = async () => {
    await requirePermission(['EMISSOR', 'SUPER_ADMIN']);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Fila de Emissão</h1>
                <p className="text-sm text-muted-foreground">
                    Gerencie e processe as solicitações de nota fiscal
                </p>
            </div>

            <Suspense fallback={<EmissorTableSkeleton />}>
                <EmissorContent />
            </Suspense>
        </div>
    );
};

export default EmissorPage;
