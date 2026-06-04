import type { Metadata } from 'next';

import { requirePermission } from '@/utils/require-permission';

import { AuditoriaContent } from './auditoria-content';

export const metadata: Metadata = {
    title: 'Auditoria',
};

const AuditoriaPage = async () => {
    await requirePermission(['SUPER_ADMIN']);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Auditoria</h1>
                <p className="text-sm text-muted-foreground">
                    Histórico de ações realizadas no sistema
                </p>
            </div>

            <AuditoriaContent />
        </div>
    );
};

export default AuditoriaPage;
