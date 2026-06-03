'use client';

import { ClipboardList, Receipt, ScrollText, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/logo';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

const navGroups = [
    {
        label: 'Menu',
        items: [
            {
                label: 'Solicitação',
                href: '/solicitacao',
                icon: ClipboardList,
                roles: ['RECEPCAO'] as Role[],
            },
            {
                label: 'Emissão',
                href: '/emissor',
                icon: Receipt,
                roles: ['EMISSOR'] as Role[],
            },
        ],
    },
    {
        label: 'Configurações',
        items: [
            {
                label: 'Equipe',
                href: '/equipe',
                icon: Users,
                roles: ['SUPER_ADMIN'] as Role[],
            },
            {
                label: 'Auditoria',
                href: '/auditoria',
                icon: ScrollText,
                roles: ['SUPER_ADMIN'] as Role[],
            },
        ],
    },
];

export const Sidebar = ({ role }: { role: Role }) => {
    const pathname = usePathname();

    const grupos = navGroups
        .map((grupo) => ({
            ...grupo,
            items: grupo.items.filter((item) => item.roles.includes(role)),
        }))
        .filter((grupo) => grupo.items.length > 0);

    return (
        <aside className="flex h-full w-56 shrink-0 flex-col border-r bg-card">
            <div className="flex h-14 items-center border-b px-4">
                <Logo iconClassName="size-6" textClassName="text-sm" />
            </div>

            <nav className="flex flex-1 flex-col gap-4 p-3 pt-4">
                {grupos.map(({ label, items }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                        <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                            {label}
                        </p>
                        {items.map(({ label: itemLabel, href, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                                    pathname.startsWith(href) && 'bg-muted text-foreground',
                                )}
                            >
                                <Icon className="size-4 shrink-0" />
                                {itemLabel}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
};
