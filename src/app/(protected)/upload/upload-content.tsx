import { UploadFilters } from './upload-filters';
import { UploadTable } from './upload-table';

export const UploadContent = () => {
    return (
        <div className="space-y-4">
            <UploadFilters />
            <UploadTable />
        </div>
    );
};
