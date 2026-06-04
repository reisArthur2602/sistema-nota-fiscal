import { EmissorTableSkeleton } from './emissor-table-skeleton';

const Loading = () => {
    return (
        <div className="space-y-6">
            <div>
                <div className="h-8 w-40" />
                <div className="h-4 w-64" />
            </div>
            <EmissorTableSkeleton />
        </div>
    );
};

export default Loading;
