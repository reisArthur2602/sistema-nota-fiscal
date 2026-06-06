import { Skeleton } from '@/components/ui/skeleton';

export const AuditoriaTableSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-muted/30 px-4 py-3 border-b border-border">
                    <div className="flex gap-8">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
                <div className="divide-y divide-border">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="px-4 py-3.5 flex items-center gap-6">
                            <Skeleton className="h-4 w-32 shrink-0 font-mono" />
                            <Skeleton className="h-5 w-28 rounded-full shrink-0" />
                            <Skeleton className="h-4 w-28 shrink-0" />
                            <Skeleton className="h-4 w-24 shrink-0" />
                            <Skeleton className="h-4 flex-1 max-w-xs" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="size-7 rounded-md" />
                    <Skeleton className="size-7 rounded-md" />
                </div>
            </div>
        </div>
    );
};
