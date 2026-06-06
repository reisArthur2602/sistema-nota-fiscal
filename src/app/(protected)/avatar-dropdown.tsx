'use client';

import { LogOut } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/utils/get-initials';
import { logout } from '@/utils/logout';

const roleLabel: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    LAUDO: 'Laudo',
};

type Props = {
    nome: string;
    role: string;
};

export const AvatarDropdown = ({ nome, role }: Props) => {
    const initials = getInitials(nome);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="rounded-full p-0 size-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                    <Avatar className="size-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal py-2">
                    <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-foreground leading-tight truncate">
                                {nome}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {roleLabel[role] ?? role}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onSelect={() => void logout()}
                >
                    <LogOut className="size-3.5" />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
