'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import type { Role } from '@/generated/prisma/enums';
import { cn } from '@/lib/utils';

import { navGroups } from './nav-items';

export const MobileSidebar = ({ role }: { role: Role }) => {
    const pathname = usePathname();
    const [aberto, setAberto] = useState(false);

    const grupos = navGroups
        .map((grupo) => ({
            ...grupo,
            items: grupo.items.filter((item) => item.roles.includes(role)),
        }))
        .filter((grupo) => grupo.items.length > 0);

    return (
        <Sheet open={aberto} onOpenChange={setAberto}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-56 p-0">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>

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
                                    onClick={() => setAberto(false)}
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
            </SheetContent>
        </Sheet>
    );
};
