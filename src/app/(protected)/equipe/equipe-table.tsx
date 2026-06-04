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
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
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

import { equipeColumns, type UsuarioRow } from './equipe-columns';
import { UsuarioDialog } from './usuario-dialog';

export type { UsuarioRow };

const globalFilterFn: FilterFn<UsuarioRow> = (row, _columnId, filterValue: string) => {
    const s = filterValue.toLowerCase();
    return (
        row.original.nome.toLowerCase().includes(s) ||
        row.original.usuario.toLowerCase().includes(s)
    );
};

export const EquipeTable = ({ usuarios }: { usuarios: UsuarioRow[] }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: usuarios,
        columns: equipeColumns,
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

    const getColumnFilter = (id: string) =>
        (columnFilters.find((f) => f.id === id)?.value as string) ?? 'todos';

    const setColumnFilter = (id: string, value: string) =>
        setColumnFilters((prev) => {
            const sem = prev.filter((f) => f.id !== id);
            return value === 'todos' ? sem : [...sem, { id, value }];
        });

    const { pageIndex } = table.getState().pagination;
    const pageSize = table.getState().pagination.pageSize;
    const totalFiltrado = table.getFilteredRowModel().rows.length;
    const inicio = pageIndex * pageSize + 1;
    const fim = Math.min((pageIndex + 1) * pageSize, totalFiltrado);
    const temFiltro = globalFilter || columnFilters.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div className="flex flex-wrap items-end gap-2">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            placeholder="Buscar por nome ou usuário..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-56"
                        />
                        <Button type="submit" variant="outline">
                            <Search className="size-4" />
                            Buscar
                        </Button>
                    </form>

                    <Select
                        value={getColumnFilter('role')}
                        onValueChange={(v) => setColumnFilter('role', v)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Todos os perfis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os perfis</SelectItem>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            <SelectItem value="RECEPCAO">Recepção</SelectItem>
                            <SelectItem value="EMISSOR">Emissor</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={getColumnFilter('ativo')}
                        onValueChange={(v) => setColumnFilter('ativo', v)}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Situação" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todas</SelectItem>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
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

                <UsuarioDialog>
                    <Button>
                        <Plus className="size-4" />
                        Novo usuário
                    </Button>
                </UsuarioDialog>
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
                                    colSpan={equipeColumns.length}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    Nenhum usuário encontrado.
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
