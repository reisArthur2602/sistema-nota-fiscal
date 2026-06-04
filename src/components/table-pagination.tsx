import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
    page: number;
    total: number;
    perPage: number;
    searchParams?: Record<string, string | undefined>;
};

export const TablePagination = ({ page, total, perPage, searchParams = {} }: Props) => {
    const totalPages = Math.ceil(total / perPage);

    if (totalPages <= 1) return null;

    const buildHref = (p: number) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        params.set('page', String(p));
        return `?${params.toString()}`;
    };

    const inicio = (page - 1) * perPage + 1;
    const fim = Math.min(page * perPage, total);

    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
                {inicio}–{fim} de {total} registro{total !== 1 ? 's' : ''}
            </p>

            <div className="flex items-center gap-1">
                <Button
                    asChild
                    variant="outline"
                    size="icon-sm"
                    className={cn(page <= 1 && 'pointer-events-none opacity-50')}
                >
                    <Link href={buildHref(page - 1)}>
                        <ChevronLeft className="size-4" />
                    </Link>
                </Button>

                <span className="min-w-16 text-center text-xs">
                    {page} / {totalPages}
                </span>

                <Button
                    asChild
                    variant="outline"
                    size="icon-sm"
                    className={cn(page >= totalPages && 'pointer-events-none opacity-50')}
                >
                    <Link href={buildHref(page + 1)}>
                        <ChevronRight className="size-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};
