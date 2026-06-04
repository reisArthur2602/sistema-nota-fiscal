import { AuditoriaTableSkeleton } from './auditoria-table-skeleton';

const Loading = () => {
    return (
        <div className="space-y-6">
            <div>
                <div className="h-8 w-24" />
                <div className="h-4 w-64" />
            </div>
            <AuditoriaTableSkeleton />
        </div>
    );
};

export default Loading;
