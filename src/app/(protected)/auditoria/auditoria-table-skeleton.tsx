import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const AuditoriaTableSkeleton = () => {
    return (
        <>
            <div className="flex flex-wrap items-end gap-2">
                <Skeleton className="h-9 w-52" />
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-9 w-44" />
                <Skeleton className="h-9 w-20" />
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data / Hora</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="mb-1 h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-28 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-56" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};
