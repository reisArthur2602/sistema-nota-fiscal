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

import { listarLogsAction } from './actions';
import { auditoriaColumns } from './auditoria-columns';
import { AuditoriaTableSkeleton } from './auditoria-table-skeleton';

export const AuditoriaTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const usuario = searchParams.get('usuario') ?? undefined;
    const tipo = searchParams.get('tipo') ?? undefined;
    const page = Number(searchParams.get('page') ?? '1');

    const { data, isLoading } = useQuery({
        queryKey: ['logs', { usuario, tipo, page }],
        queryFn: () => listarLogsAction({ usuario, tipo, page }),
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

    if (isLoading && !data) return <AuditoriaTableSkeleton />;

    const navigate = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.replace(`?${params.toString()}`);
    };

    const pageCount = Math.ceil(total / perPage) || 1;

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-transparent border-b border-border"
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={auditoriaColumns.length}
                                    className="text-center py-16 text-muted-foreground"
                                >
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {total} registro{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {pageCount}
                    </span>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={page <= 1}
                        onClick={() => navigate(page - 1)}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={page >= pageCount}
                        onClick={() => navigate(page + 1)}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
