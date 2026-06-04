import { ClipboardList, Receipt, ScrollText, Users } from 'lucide-react';

import type { Role } from '@/generated/prisma/enums';

export type NavItem = {
    label: string;
    href: string;
    icon: React.ElementType;
    roles: Role[];
};

export type NavGroup = {
    label: string;
    items: NavItem[];
};

export const navGroups: NavGroup[] = [
    {
        label: 'Menu',
        items: [
            {
                label: 'Solicitação',
                href: '/solicitacao',
                icon: ClipboardList,
                roles: ['RECEPCAO', 'SUPER_ADMIN'],
            },
            {
                label: 'Emissão',
                href: '/emissor',
                icon: Receipt,
                roles: ['EMISSOR', 'SUPER_ADMIN'],
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
                roles: ['SUPER_ADMIN'],
            },
            {
                label: 'Auditoria',
                href: '/auditoria',
                icon: ScrollText,
                roles: ['SUPER_ADMIN'],
            },
        ],
    },
];
