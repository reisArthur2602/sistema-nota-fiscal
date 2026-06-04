import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const EquipeTableSkeleton = () => {
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-52" />
                </div>
                <Skeleton className="h-9 w-32" />
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Perfil</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="mb-1 h-4 w-36" />
                                    <Skeleton className="h-3 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="ml-auto h-7 w-7 rounded-md" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};
