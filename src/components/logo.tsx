import { Activity } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type LogoProps = {
    href?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'light';
};

const config = {
    sm: { box: 'size-8', icon: 'size-4', text: 'text-lg', gap: 'gap-2' },
    md: { box: 'size-9', icon: 'size-[18px]', text: 'text-xl', gap: 'gap-2.5' },
    lg: { box: 'size-11', icon: 'size-5', text: 'text-2xl', gap: 'gap-3' },
};

export const Logo = ({ href = '/', className, size = 'md', variant = 'default' }: LogoProps) => {
    const c = config[size];
    const isLight = variant === 'light';

    return (
        <Link href={href} className={cn('inline-flex items-center group', c.gap, className)}>
            <div className="relative">
                {/* Soft ambient glow — pulses slowly */}
                <div className="absolute -inset-0.5 rounded-2xl bg-blue-500/20 blur-sm animate-pulse" />

                {/* Hover glow — stronger, appears on hover */}
                <div className="absolute -inset-1 rounded-2xl bg-blue-500/40 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Icon container with gradient */}
                <div
                    className={cn(
                        'relative flex items-center justify-center rounded-xl',
                        'bg-linear-to-br from-blue-400 via-blue-500 to-indigo-700',
                        'shadow-md shadow-blue-500/30',
                        'transition-transform duration-200 ease-out group-hover:scale-110',
                        c.box
                    )}
                >
                    {/* Inner top-left highlight */}
                    <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-white/30 to-transparent" />

                    <Activity className={cn('relative z-10 text-white', c.icon)} />
                </div>
            </div>

            <span className={cn('font-bold tracking-tight', c.text)}>
                {isLight ? (
                    <span className="text-white/85">
                        Meu<span className="text-white font-extrabold">Exame</span>
                    </span>
                ) : (
                    <span className="text-foreground">
                        Meu<span className="text-blue-500">Exame</span>
                    </span>
                )}
            </span>
        </Link>
    );
};
