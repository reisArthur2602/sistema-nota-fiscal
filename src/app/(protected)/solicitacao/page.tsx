import { Suspense } from 'react';
import type { Metadata } from 'next';

import { requirePermission } from '@/utils/require-permission';

import { SolicitacaoForm } from './solicitacao-form';
import { SolicitacoesRecentes } from './solicitacoes-recentes';
import { SolicitacoesRecentesSkeleton } from './solicitacoes-recentes-skeleton';

export const metadata: Metadata = {
    title: 'Solicitações',
};

const SolicitacaoPage = async () => {
    await requirePermission(['RECEPCAO', 'SUPER_ADMIN']);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Solicitações</h1>
                <p className="text-sm text-muted-foreground">
                    Crie e acompanhe as solicitações de nota fiscal
                </p>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[400px_1fr]">
                <div className="space-y-3">
                    <p className="text-sm font-medium">Nova Solicitação</p>
                    <SolicitacaoForm />
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-medium">Últimas Solicitações</p>
                    <Suspense fallback={<SolicitacoesRecentesSkeleton />}>
                        <SolicitacoesRecentes />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default SolicitacaoPage;
