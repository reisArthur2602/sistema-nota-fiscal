'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const UploadFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [local, setLocal] = useState({
        search: searchParams.get('search') ?? '',
        status: searchParams.get('status') ?? 'todos',
    });

    const push = (overrides: Partial<typeof local>) => {
        const next = { ...local, ...overrides };
        const params = new URLSearchParams();
        if (next.search) params.set('search', next.search);
        if (next.status && next.status !== 'todos') params.set('status', next.status);
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
                    placeholder="Nome, CPF ou protocolo..."
                    className="pl-9"
                    value={local.search}
                    onChange={(e) => setLocal((p) => ({ ...p, search: e.target.value }))}
                />
            </div>

            <Select
                value={local.status}
                onValueChange={(value) => {
                    setLocal((p) => ({ ...p, status: value }));
                    push({ status: value });
                }}
            >
                <SelectTrigger className="w-36">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
            </Select>

            <Button type="submit" variant="secondary">
                Buscar
            </Button>
        </form>
    );
};
