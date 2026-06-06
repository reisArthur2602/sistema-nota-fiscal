'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { ClipboardCopy, MoreHorizontal, Power, PowerOff } from 'lucide-react';

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

import { toggleExameAtivoAction } from './actions';

export type ExameRow = {
    id: string;
    cpf: string;
    nomePaciente: string;
    protocolo: string;
    ativo: boolean;
    criadoEm: Date;
    criadoPor: { nome: string };
};

const formatCPF = (cpf: string) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

const ExameActionsCell = ({ exame }: { exame: ExameRow }) => {
    const queryClient = useQueryClient();
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';
    const link = `${baseUrl}/exame?c=${exame.cpf}&p=${exame.protocolo}`;

    const mutation = useMutation({
        mutationFn: (ativo: boolean) => toggleExameAtivoAction(exame.id, ativo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exames'] });
        },
    });

    const copiarLink = () => {
        navigator.clipboard.writeText(link);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" disabled={mutation.isPending}>
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={copiarLink}>
                    <ClipboardCopy className="size-4" />
                    Copiar link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => mutation.mutate(!exame.ativo)}
                    disabled={mutation.isPending}
                    className={exame.ativo ? 'text-destructive focus:text-destructive' : ''}
                >
                    {exame.ativo ? (
                        <>
                            <PowerOff className="size-4" />
                            Inativar
                        </>
                    ) : (
                        <>
                            <Power className="size-4" />
                            Reativar
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const uploadColumns: ColumnDef<ExameRow>[] = [
    {
        accessorKey: 'nomePaciente',
        header: 'Paciente',
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-foreground">{row.original.nomePaciente}</p>
                <p className="text-xs text-muted-foreground font-mono">
                    {formatCPF(row.original.cpf)}
                </p>
            </div>
        ),
    },
    {
        accessorKey: 'protocolo',
        header: 'Protocolo',
        cell: ({ row }) => (
            <span className="font-mono text-sm">{row.original.protocolo}</span>
        ),
    },
    {
        accessorKey: 'criadoPor',
        header: 'Cadastrado por',
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">{row.original.criadoPor.nome}</span>
        ),
    },
    {
        accessorKey: 'criadoEm',
        header: 'Data',
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.original.criadoEm)}
            </span>
        ),
    },
    {
        accessorKey: 'ativo',
        header: 'Status',
        cell: ({ row }) =>
            row.original.ativo ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    Ativo
                </Badge>
            ) : (
                <Badge variant="secondary">Inativo</Badge>
            ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <ExameActionsCell exame={row.original} />,
    },
];
