import { cn } from '@/lib/utils';

const LogoIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect width="32" height="32" rx="7" className="fill-foreground" />
        <path
            d="M9 8.5h14v12.5l-2-1.25-2 1.25-2-1.25-2 1.25-2-1.25-2 1.25V8.5z"
            className="fill-background opacity-10"
        />
        <path
            d="M11.5 13.5h9M11.5 17h6"
            className="stroke-background"
            strokeWidth="1.75"
            strokeLinecap="round"
        />
    </svg>
);

type LogoProps = {
    iconOnly?: boolean;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
};

export const Logo = ({
    iconOnly = false,
    className,
    iconClassName,
    textClassName,
}: LogoProps) => {
    return (
        <div className={cn('flex items-center gap-2.5', className)}>
            <LogoIcon className={cn('size-7 shrink-0', iconClassName)} />
            {!iconOnly && (
                <span className={cn('font-semibold tracking-tight', textClassName)}>
                    NotaFácil
                </span>
            )}
        </div>
    );
};
