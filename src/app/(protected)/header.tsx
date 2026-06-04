'use client';

import { usePathname } from 'next/navigation';

import type { Role } from '@/generated/prisma/enums';

import { AvatarDropdown } from './avatar-dropdown';
import { MobileSidebar } from './mobile-sidebar';

const routeLabels: Record<string, string> = {
    solicitacao: 'Solicitação',
    emissor: 'Emissão',
    equipe: 'Equipe',
    auditoria: 'Auditoria',
};

type HeaderProps = {
    nome: string;
    usuario: string;
    role: Role;
};

export const Header = ({ nome, usuario, role }: HeaderProps) => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = segments.map((seg) => routeLabels[seg] ?? seg);

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-2">
                <MobileSidebar role={role} />

                <nav className="hidden items-center gap-1.5 text-sm sm:flex">
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
            </div>

            <AvatarDropdown nome={nome} usuario={usuario} />
        </header>
    );
};
