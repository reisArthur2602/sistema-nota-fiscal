'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LOG_TIPOS } from '@/utils/log-format';

export const AuditoriaFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [local, setLocal] = useState({
        usuario: searchParams.get('usuario') ?? '',
        tipo: searchParams.get('tipo') ?? 'todos',
    });

    const push = (overrides: Partial<typeof local>) => {
        const next = { ...local, ...overrides };
        const params = new URLSearchParams();
        if (next.usuario) params.set('usuario', next.usuario);
        if (next.tipo && next.tipo !== 'todos') params.set('tipo', next.tipo);
        params.set('page', '1');
        router.replace(`?${params.toString()}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        push({});
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Buscar por usuário..."
                    className="pl-9"
                    value={local.usuario}
                    onChange={(e) => setLocal((p) => ({ ...p, usuario: e.target.value }))}
                />
            </div>

            <Select
                value={local.tipo}
                onValueChange={(value) => {
                    setLocal((p) => ({ ...p, tipo: value }));
                    push({ tipo: value });
                }}
            >
                <SelectTrigger className="w-52">
                    <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos">Todas as ações</SelectItem>
                    {LOG_TIPOS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                            {t.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button type="submit" variant="secondary" size="sm">
                Buscar
            </Button>
        </form>
    );
};
