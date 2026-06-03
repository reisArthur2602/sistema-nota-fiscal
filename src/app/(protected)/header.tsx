'use client';

import { usePathname } from 'next/navigation';

import { AvatarDropdown } from './avatar-dropdown';

const routeLabels: Record<string, string> = {
    solicitacao: 'Solicitação',
    emissor: 'Emissão',
    equipe: 'Equipe',
    auditoria: 'Auditoria',
};

export const Header = () => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = segments.map((seg) => routeLabels[seg] ?? seg);

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6">
            <nav className="flex items-center gap-1.5 text-sm">
                {breadcrumbs.map((label, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-muted-foreground/50">/</span>}
                        <span
                            className={
                                i === breadcrumbs.length - 1
                                    ? 'font-medium text-foreground'
                                    : 'text-muted-foreground'
                            }
                        >
                            {label}
                        </span>
                    </span>
                ))}
            </nav>

            <AvatarDropdown />
        </header>
    );
};
