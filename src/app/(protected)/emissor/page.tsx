import type { Metadata } from 'next';

import { listarSolicitacoes } from './actions';
import { EmissorTable } from './emissor-table';
import { StatusFilter } from './status-filter';

export const metadata: Metadata = {
    title: 'Emissão',
};

const EmissorPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) => {
    const { status } = await searchParams;
    const solicitacoes = await listarSolicitacoes(status);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Fila de Emissão</h1>
                <p className="text-sm text-muted-foreground">
                    Gerencie e processe as solicitações de nota fiscal
                </p>
            </div>

            <StatusFilter statusAtual={status} />

            <EmissorTable solicitacoes={solicitacoes} />
        </div>
    );
};

export default EmissorPage;
