import { Suspense } from 'react';
import type { Metadata } from 'next';

import { requirePermission } from '@/utils/require-permission';

import { AuditoriaContent } from './auditoria-content';
import { AuditoriaTableSkeleton } from './auditoria-table-skeleton';

export const metadata: Metadata = {
    title: 'Auditoria',
};

const AuditoriaPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ usuario?: string; acao?: string; periodo?: string }>;
}) => {
    await requirePermission(['SUPER_ADMIN']);
    const { usuario, acao, periodo } = await searchParams;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Auditoria</h1>
                <p className="text-sm text-muted-foreground">
                    Histórico de ações realizadas no sistema
                </p>
            </div>

            <Suspense fallback={<AuditoriaTableSkeleton />}>
                <AuditoriaContent usuario={usuario} acao={acao} periodo={periodo} />
            </Suspense>
        </div>
    );
};

export default AuditoriaPage;
