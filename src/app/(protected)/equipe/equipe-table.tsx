'use client';

import { useState } from 'react';
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

import { equipeColumns, type UsuarioRow } from './equipe-columns';

const globalFilterFn: FilterFn<UsuarioRow> = (row, _, filterValue: string) => {
    const q = filterValue.toLowerCase();
    return (
        row.original.nome.toLowerCase().includes(q) ||
        row.original.usuario.toLowerCase().includes(q)
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
        initialState: { pagination: { pageSize: 10 } },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalFilter(searchInput);
    };

    const setRoleFilter = (value: string) => {
        setColumnFilters((prev) => {
            const without = prev.filter((f) => f.id !== 'role');
            return value === 'todos' ? without : [...without, { id: 'role', value }];
        });
    };

    const setStatusFilter = (value: string) => {
        setColumnFilters((prev) => {
            const without = prev.filter((f) => f.id !== 'ativo');
            return value === 'todos' ? without : [...without, { id: 'ativo', value }];
        });
    };

    const roleFilter =
        (columnFilters.find((f) => f.id === 'role')?.value as string) ?? 'todos';
    const statusFilter =
        (columnFilters.find((f) => f.id === 'ativo')?.value as string) ?? 'todos';

    const { pageIndex } = table.getState().pagination;
    const totalFiltered = table.getFilteredRowModel().rows.length;

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-52">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Nome ou usuário..."
                        className="pl-9"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos os perfis</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        <SelectItem value="LAUDO">Laudo</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ativo">Ativos</SelectItem>
                        <SelectItem value="inativo">Inativos</SelectItem>
                    </SelectContent>
                </Select>

                <Button type="submit" variant="secondary" size="sm">
                    Buscar
                </Button>
            </form>

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
                                    colSpan={equipeColumns.length}
                                    className="text-center py-16 text-muted-foreground"
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
                    {totalFiltered} usuário{totalFiltered !== 1 ? 's' : ''} encontrado
                    {totalFiltered !== 1 ? 's' : ''}
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Página {pageIndex + 1} de {table.getPageCount() || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
