'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { listarLogs } from './actions';
import { auditoriaColumns } from './auditoria-columns';
import { AuditoriaTableSkeleton } from './auditoria-table-skeleton';

export const AuditoriaTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const usuario = searchParams.get('usuario') ?? undefined;
    const acao = searchParams.get('acao') ?? undefined;
    const periodo = searchParams.get('periodo') ?? undefined;
    const page = Number(searchParams.get('page') ?? '1');

    const { data, isLoading } = useQuery({
        queryKey: ['logs', { usuario, acao, periodo, page }],
        queryFn: () => listarLogs({ usuario, acao, periodo, page }),
        placeholderData: keepPreviousData,
    });

    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const perPage = data?.perPage ?? 15;

    const table = useReactTable({
        data: items,
        columns: auditoriaColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(total / perPage),
    });

    const goToPage = (p: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(p));
        router.replace(`?${params.toString()}`);
    };

    if (isLoading || !data) return <AuditoriaTableSkeleton />;

    const totalPages = Math.ceil(total / perPage);
    const inicio = total === 0 ? 0 : (page - 1) * perPage + 1;
    const fim = Math.min(page * perPage, total);

    return (
        <>
            <div className="overflow-hidden rounded-2xl border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={auditoriaColumns.length}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    Nenhum registro encontrado para os filtros aplicados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        {inicio}–{fim} de {total} registro{total !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => goToPage(page - 1)}
                            className={cn(page <= 1 && 'pointer-events-none opacity-50')}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="min-w-16 text-center text-xs">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => goToPage(page + 1)}
                            className={cn(page >= totalPages && 'pointer-events-none opacity-50')}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
