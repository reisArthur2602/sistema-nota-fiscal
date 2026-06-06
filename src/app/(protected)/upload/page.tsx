import { type Metadata } from 'next';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';

import { NovoExameDialog } from './novo-exame-dialog';
import { UploadContent } from './upload-content';
import { UploadTableSkeleton } from './upload-table-skeleton';

export const metadata: Metadata = {
    title: 'Exames',
};

const UploadPage = async () => {
    return (
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Envios</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Gerencie os resultados cadastrados na plataforma.
                    </p>
                </div>

                <NovoExameDialog>
                    <Button>
                        <Plus className="size-4" />
                        Novo exame
                    </Button>
                </NovoExameDialog>
            </div>

            <Suspense fallback={<UploadTableSkeleton />}>
                <UploadContent />
            </Suspense>
        </main>
    );
};

export default UploadPage;
