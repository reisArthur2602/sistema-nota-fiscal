import type { Prisma } from '@/generated/prisma/client';
import { StatusSolicitacao } from '@/generated/prisma/enums';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/utils/format-date';

import { DetalhesDialog } from './detalhes-dialog';
import { EnviarNotaDialog } from './enviar-nota-dialog';

export type SolicitacaoRow = Prisma.SolicitacaoGetPayload<{
    include: { criadoPor: { select: { nome: true; usuario: true } } };
}>;

export const statusConfig: Record<StatusSolicitacao, { label: string; className: string }> = {
    PENDENTE: {
        label: 'Pendente',
        className: 'border-border bg-transparent text-muted-foreground',
    },
    EMITIDA: {
        label: 'Emitida',
        className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    ENVIADA_AO_PACIENTE: {
        label: 'Enviada',
        className: 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400',
    },
};

const columnHelper = createColumnHelper<SolicitacaoRow>();

export const emissorColumns = [
    columnHelper.accessor('idRegistro', {
        header: 'Registro',
        cell: (info) => (
            <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('nome', {
        header: 'Paciente',
        cell: (info) => (
            <>
                <p className="font-medium">{info.getValue()}</p>
                <p className="text-xs text-muted-foreground">{info.row.original.cpf}</p>
            </>
        ),
    }),
    columnHelper.accessor('especialidade', {
        header: 'Especialidade',
        cell: (info) => (
            <span className="block max-w-48 truncate text-muted-foreground">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('data', {
        header: 'Data',
        cell: (info) => (
            <span className="text-muted-foreground">{formatDate(info.getValue())}</span>
        ),
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        filterFn: (row, _columnId, filterValue: string) => row.original.status === filterValue,
        cell: (info) => {
            const cfg = statusConfig[info.getValue()];
            return <Badge className={cfg.className}>{cfg.label}</Badge>;
        },
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
                        <DetalhesDialog solicitacao={row.original}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                Ver detalhes
                            </DropdownMenuItem>
                        </DetalhesDialog>
                        <EnviarNotaDialog solicitacao={row.original}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                Enviar nota
                            </DropdownMenuItem>
                        </EnviarNotaDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    }),
];
