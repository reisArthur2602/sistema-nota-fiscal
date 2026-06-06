import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = ({ rows = 2, hasTextarea = false }: { rows?: number; hasTextarea?: boolean }) => (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
            <Skeleton className="size-9 rounded-xl shrink-0" />
            <div className="space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-80" />
            </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-6 space-y-6">
            {/* Toggle status row */}
            <Skeleton className="h-20 w-full rounded-xl" />

            {/* Fields */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Separator */}
            <Skeleton className="h-px w-full" />

            {/* Second section */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-36" />
                <div className="space-y-1.5">
                    <Skeleton className="h-3 w-28" />
                    {hasTextarea ? (
                        <Skeleton className="h-24 w-full rounded-lg" />
                    ) : (
                        <Skeleton className="h-10 w-full rounded-lg" />
                    )}
                    <Skeleton className="h-3 w-64" />
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 w-44 rounded-lg" />
                <Skeleton className="h-10 w-36 rounded-lg" />
            </div>
        </div>
    </div>
);

export const ConfiguracoesSkeleton = () => (
    <div className="space-y-6">
        <CardSkeleton rows={2} hasTextarea />
        <CardSkeleton rows={4} />
    </div>
);
