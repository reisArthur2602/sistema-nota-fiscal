'use client';

import { type PropsWithChildren, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { ClipboardCopy, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCPF } from '@/utils/format-cpf';
import { formatDate } from '@/utils/format-date';

import { removerExameAction } from './actions';

export type ExameRow = {
    id: string;
    cpf: string;
    nomePaciente: string;
    protocolo: string;
    ativo: boolean;
    criadoEm: Date;
    criadoPor: { nome: string };
};

const RemoverExameDialog = ({ exame, children }: PropsWithChildren<{ exame: ExameRow }>) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => removerExameAction(exame.id),
        onSuccess: (result) => {
            if (result.success) {
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ['exames'] });
            }
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remover exame</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação remove permanentemente o exame de{' '}
                        <span className="font-medium text-foreground">{exame.nomePaciente}</span>{' '}
                        (protocolo {exame.protocolo}), excluindo o registro e o arquivo do servidor
                        FTP. Não é possível desfazer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            mutation.mutate();
                        }}
                        disabled={mutation.isPending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
                        {mutation.isPending ? 'Removendo...' : 'Remover'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const ExameActionsCell = ({ exame }: { exame: ExameRow }) => {
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';
    const link = `${baseUrl}/exame?c=${exame.cpf}&p=${exame.protocolo}`;

    const copiarLink = () => {
        navigator.clipboard.writeText(link);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={copiarLink}>
                    <ClipboardCopy className="size-4" />
                    Copiar link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <RemoverExameDialog exame={exame}>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="size-4" />
                        Remover
                    </DropdownMenuItem>
                </RemoverExameDialog>
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
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.protocolo}</span>,
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
        id: 'actions',
        cell: ({ row }) => <ExameActionsCell exame={row.original} />,
    },
];
