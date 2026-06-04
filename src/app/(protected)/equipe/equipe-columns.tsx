'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Role, Usuario } from '@/generated/prisma/browser';

import { toggleAtivo } from './actions';
import { UsuarioDialog } from './usuario-dialog';

export type UsuarioRow = Pick<Usuario, 'id' | 'nome' | 'usuario' | 'role' | 'ativo'>;

export const roleConfig: Record<Role, { label: string; className: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', className: '' },
    RECEPCAO: { label: 'Recepção', className: 'border-border bg-transparent text-muted-foreground' },
    EMISSOR: {
        label: 'Emissor',
        className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
};

const ToggleAtivoItem = ({ usuario }: { usuario: UsuarioRow }) => {
    const router = useRouter();

    const handleClick = async () => {
        const resultado = await toggleAtivo(usuario.id, !usuario.ativo);
        if (!resultado.success) { toast.error(resultado.message); return; }
        toast.success(resultado.message);
        router.refresh();
    };

    return (
        <DropdownMenuItem variant="destructive" onClick={handleClick}>
            {usuario.ativo ? 'Desativar' : 'Ativar'}
        </DropdownMenuItem>
    );
};

const columnHelper = createColumnHelper<UsuarioRow>();

export const equipeColumns = [
    columnHelper.accessor('nome', {
        header: 'Usuário',
        cell: (info) => (
            <>
                <p className="font-medium">{info.getValue()}</p>
                <p className="text-xs text-muted-foreground">@{info.row.original.usuario}</p>
            </>
        ),
    }),
    columnHelper.accessor('role', {
        header: 'Perfil',
        filterFn: (row, _columnId, filterValue: string) => row.original.role === filterValue,
        cell: (info) => {
            const cfg = roleConfig[info.getValue()];
            return <Badge className={cfg.className}>{cfg.label}</Badge>;
        },
    }),
    columnHelper.accessor('ativo', {
        header: 'Situação',
        filterFn: (row, _columnId, filterValue: string) =>
            filterValue === 'ativo' ? row.original.ativo : !row.original.ativo,
        cell: (info) =>
            info.getValue() ? (
                <Badge className="border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400">
                    Ativo
                </Badge>
            ) : (
                <Badge className="border-border bg-transparent text-muted-foreground">Inativo</Badge>
            ),
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <UsuarioDialog usuario={row.original}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                Editar
                            </DropdownMenuItem>
                        </UsuarioDialog>
                        <DropdownMenuSeparator />
                        <ToggleAtivoItem usuario={row.original} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    }),
];
