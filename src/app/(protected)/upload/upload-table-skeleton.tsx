import { Skeleton } from '@/components/ui/skeleton';

export const UploadTableSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-9 w-72" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-muted/30 px-3 py-3 border-b border-border">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="divide-y divide-border">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="px-3 py-3.5 flex items-center gap-4">
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-14 rounded-full" />
                            <Skeleton className="size-7 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
        </div>
    );
};
