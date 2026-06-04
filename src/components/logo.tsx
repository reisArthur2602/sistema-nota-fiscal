import { Receipt } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type LogoProps = {
    href?: string;
    iconOnly?: boolean;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
};

export const Logo = ({
    href = '/',
    iconOnly = false,
    className,
    iconClassName,
    textClassName,
}: LogoProps) => {
    return (
        <Link href={href} className={cn('flex items-center gap-1', className)}>
            <div
                className={cn(
                    'logo-gradient relative flex shrink-0 items-center justify-center rounded-xl shadow-md shadow-primary/30',
                    'size-9',
                    iconClassName,
                )}
            >
                <Receipt className="size-[72%] text-white drop-shadow-sm" strokeWidth={2} />
            </div>

            {!iconOnly && (
                <span className={cn('font-semibold tracking-tight', textClassName)}>
                    Nota<span className="text-primary">Fácil</span>
                </span>
            )}
        </Link>
    );
};
