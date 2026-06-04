'use client';

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnFiltersState,
    type FilterFn,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PER_PAGE } from '@/constants';
import { cn } from '@/lib/utils';

import { emissorColumns, type SolicitacaoRow } from './emissor-columns';

export type { SolicitacaoRow };

const globalFilterFn: FilterFn<SolicitacaoRow> = (row, _columnId, filterValue: string) => {
    const s = filterValue.toLowerCase();
    return (
        row.original.nome.toLowerCase().includes(s) ||
        row.original.cpf.includes(s) ||
        row.original.idRegistro.toLowerCase().includes(s) ||
        row.original.especialidade.toLowerCase().includes(s)
    );
};

export const EmissorTable = ({ solicitacoes }: { solicitacoes: SolicitacaoRow[] }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: solicitacoes,
        columns: emissorColumns,
        state: { globalFilter, columnFilters },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        globalFilterFn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: PER_PAGE } },
    });

    const handleSearch = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setGlobalFilter(searchInput);
    };

    const statusAtual =
        (columnFilters.find((f) => f.id === 'status')?.value as string) ?? 'todos';

    const handleStatusChange = (value: string) =>
        setColumnFilters(value === 'todos' ? [] : [{ id: 'status', value }]);

    const { pageIndex } = table.getState().pagination;
    const pageSize = table.getState().pagination.pageSize;
    const totalFiltrado = table.getFilteredRowModel().rows.length;
    const inicio = pageIndex * pageSize + 1;
    const fim = Math.min((pageIndex + 1) * pageSize, totalFiltrado);
    const temFiltro = globalFilter || statusAtual !== 'todos';

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-2">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Buscar paciente, CPF, registro..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-64"
                    />
                    <Button type="submit" variant="outline">
                        <Search className="size-4" />
                        Buscar
                    </Button>
                </form>

                <Select value={statusAtual} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                        <SelectItem value="EMITIDA">Emitida</SelectItem>
                        <SelectItem value="ENVIADA_AO_PACIENTE">Enviada</SelectItem>
                    </SelectContent>
                </Select>

                {temFiltro && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setGlobalFilter('');
                            setSearchInput('');
                            setColumnFilters([]);
                        }}
                    >
                        Limpar
                    </Button>
                )}
            </div>

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
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={emissorColumns.length}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    Nenhuma solicitação encontrada.
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

            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        {inicio}–{fim} de {totalFiltrado} registro
                        {totalFiltrado !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => table.previousPage()}
                            className={cn(
                                !table.getCanPreviousPage() && 'pointer-events-none opacity-50',
                            )}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="min-w-16 text-center text-xs">
                            {pageIndex + 1} / {table.getPageCount()}
                        </span>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => table.nextPage()}
                            className={cn(
                                !table.getCanNextPage() && 'pointer-events-none opacity-50',
                            )}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
