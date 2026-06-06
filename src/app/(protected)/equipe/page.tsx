import { type Metadata } from 'next';
import { Suspense } from 'react';
import { UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { requirePermission } from '@/utils/require-permission';

import { EquipeContent } from './equipe-content';
import { EquipeTableSkeleton } from './equipe-table-skeleton';
import { UsuarioDialog } from './usuario-dialog';

export const metadata: Metadata = {
    title: 'Equipe',
};

const EquipePage = async () => {
    await requirePermission(['SUPER_ADMIN']);

    return (
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Equipe</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Gerencie os usuários do sistema.
                    </p>
                </div>

                <UsuarioDialog>
                    <Button>
                        <UserPlus className="size-4" />
                        Novo usuário
                    </Button>
                </UsuarioDialog>
            </div>

            <Suspense fallback={<EquipeTableSkeleton />}>
                <EquipeContent />
            </Suspense>
        </main>
    );
};

export default EquipePage;
