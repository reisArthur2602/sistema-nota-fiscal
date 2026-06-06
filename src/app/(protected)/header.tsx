import { ClipboardList, FileText, ScrollText, Settings2, Users } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { requireAuth } from '@/utils/require-auth';

import { AvatarDropdown } from './avatar-dropdown';
import { OnboardingDialog } from './onboarding-dialog';

const navItems = [
    { href: '/upload', label: 'Exames', icon: ClipboardList, roles: ['SUPER_ADMIN'] },
    { href: '/equipe', label: 'Equipe', icon: Users, roles: ['SUPER_ADMIN'] },
    { href: '/auditoria', label: 'Auditoria', icon: ScrollText, roles: ['SUPER_ADMIN'] },
    { href: '/configuracoes', label: 'Configurações', icon: Settings2, roles: ['SUPER_ADMIN'] },
];

export const Header = async () => {
    const session = await requireAuth();
    const jar = await cookies();
    const showOnboarding = !jar.has('me_onboarding_done');

    const visibleNav = navItems.filter((item) => item.roles.includes(session.role));

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-card/90 backdrop-blur-md border-b border-border">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href="/upload" className="flex items-center gap-2 shrink-0">
                            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
                                <FileText className="size-3.5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-base">MeuExame</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            {visibleNav.map((item) => (
                                <Button key={item.href} variant="ghost" size="sm" asChild>
                                    <Link href={item.href} className="gap-1.5">
                                        <item.icon className="size-3.5" />
                                        {item.label}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </div>

                    <AvatarDropdown nome={session.nome} role={session.role} />
                </div>
            </header>

            <OnboardingDialog show={showOnboarding} nome={session.nome} role={session.role} />
        </>
    );
};
