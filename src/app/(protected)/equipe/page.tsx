import { Suspense } from 'react';
import type { Metadata } from 'next';

import { requirePermission } from '@/utils/require-permission';

import { EquipeContent } from './equipe-content';
import { EquipeTableSkeleton } from './equipe-table-skeleton';

export const metadata: Metadata = {
    title: 'Equipe',
};

const EquipePage = async () => {
    await requirePermission(['SUPER_ADMIN']);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Equipe</h1>
                <p className="text-sm text-muted-foreground">
                    Gerencie os usuários e perfis de acesso
                </p>
            </div>

            <Suspense fallback={<EquipeTableSkeleton />}>
                <EquipeContent />
            </Suspense>
        </div>
    );
};

export default EquipePage;
