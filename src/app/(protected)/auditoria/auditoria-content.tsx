import { AuditoriaFilters } from './auditoria-filters';
import { AuditoriaTable } from './auditoria-table';

export const AuditoriaContent = () => {
    return (
        <div className="space-y-4">
            <AuditoriaFilters />
            <AuditoriaTable />
        </div>
    );
};
