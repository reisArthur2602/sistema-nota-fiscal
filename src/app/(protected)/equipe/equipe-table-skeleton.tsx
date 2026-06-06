import { Skeleton } from '@/components/ui/skeleton';

export const EquipeTableSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-9 flex-1 min-w-52" />
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-8 w-16" />
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-muted/30 px-4 py-3 border-b border-border">
                    <div className="flex gap-8">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="divide-y divide-border">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="px-4 py-3.5 flex items-center gap-6">
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-5 w-14 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="size-7 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="size-7 rounded-md" />
                    <Skeleton className="size-7 rounded-md" />
                </div>
            </div>
        </div>
    );
};
