'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { listExamesAction } from './actions';
import { uploadColumns } from './upload-columns';
import { UploadTableSkeleton } from './upload-table-skeleton';

export const UploadTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const page = Number(searchParams.get('page') ?? '1');

    const { data, isLoading } = useQuery({
        queryKey: ['exames', { search, status, page }],
        queryFn: () => listExamesAction({ search, status, page }),
        placeholderData: keepPreviousData,
    });

    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const perPage = data?.perPage ?? 10;
    const pageCount = Math.ceil(total / perPage);

    const table = useReactTable({
        data: items,
        columns: uploadColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount,
    });

    if (isLoading && !data) return <UploadTableSkeleton />;

    const navigate = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border">
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
                                    colSpan={uploadColumns.length}
                                    className="text-center py-16 text-muted-foreground"
                                >
                                    Nenhum exame encontrado.
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
                    {total} exame{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {pageCount || 1}
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
