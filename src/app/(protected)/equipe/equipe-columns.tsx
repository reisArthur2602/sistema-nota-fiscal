'use client';

import { useMutation } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, UserCheck, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/utils/format-date';

import { toggleUsuarioAtivoAction } from './actions';
import { UsuarioDialog } from './usuario-dialog';

export type UsuarioRow = {
    id: string;
    nome: string;
    usuario: string;
    role: 'SUPER_ADMIN' | 'LAUDO';
    ativo: boolean;
    criadoEm: Date;
};

const roleLabel: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    LAUDO: 'Laudo',
};

const UsuarioActionsCell = ({ row }: { row: UsuarioRow }) => {
    const router = useRouter();

    const toggleMutation = useMutation({
        mutationFn: () => toggleUsuarioAtivoAction(row.id, !row.ativo),
        onSuccess: () => router.refresh(),
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" disabled={toggleMutation.isPending}>
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <UsuarioDialog usuario={row}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Pencil className="size-3.5" />
                        Editar
                    </DropdownMenuItem>
                </UsuarioDialog>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => toggleMutation.mutate()}
                    disabled={toggleMutation.isPending}
                    className={row.ativo ? 'text-destructive focus:text-destructive' : ''}
                >
                    {row.ativo ? (
                        <UserX className="size-3.5" />
                    ) : (
                        <UserCheck className="size-3.5" />
                    )}
                    {row.ativo ? 'Inativar' : 'Reativar'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const columnHelper = createColumnHelper<UsuarioRow>();

export const equipeColumns = [
    columnHelper.accessor('nome', {
        id: 'nome',
        header: 'Nome',
        cell: (info) => (
            <div>
                <p className="font-medium text-sm text-foreground">{info.getValue()}</p>
                <p className="text-xs text-muted-foreground">@{info.row.original.usuario}</p>
            </div>
        ),
    }),
    columnHelper.accessor('role', {
        id: 'role',
        header: 'Perfil',
        cell: (info) => (
            <Badge variant={info.getValue() === 'SUPER_ADMIN' ? 'default' : 'secondary'}>
                {roleLabel[info.getValue()]}
            </Badge>
        ),
        filterFn: (row, _, value) => value === 'todos' || row.original.role === value,
    }),
    columnHelper.accessor('ativo', {
        id: 'ativo',
        header: 'Status',
        cell: (info) => (
            <Badge variant={info.getValue() ? 'outline' : 'secondary'}>
                {info.getValue() ? 'Ativo' : 'Inativo'}
            </Badge>
        ),
        filterFn: (row, _, value) => {
            if (value === 'todos') return true;
            return value === 'ativo' ? row.original.ativo : !row.original.ativo;
        },
    }),
    columnHelper.accessor('criadoEm', {
        header: 'Cadastrado em',
        cell: (info) => (
            <span className="text-sm text-muted-foreground">{formatDate(info.getValue())}</span>
        ),
    }),
    columnHelper.display({
        id: 'actions',
        cell: (info) => <UsuarioActionsCell row={info.row.original} />,
    }),
];
