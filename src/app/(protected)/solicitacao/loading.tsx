import { SolicitacoesRecentesSkeleton } from './solicitacoes-recentes-skeleton';

const Loading = () => {
    return (
        <div className="space-y-6">
            <div>
                <div className="h-8 w-36" />
                <div className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[400px_1fr]">
                <div className="h-64 rounded-2xl border bg-card" />
                <SolicitacoesRecentesSkeleton />
            </div>
        </div>
    );
};

export default Loading;
