'use client';

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

const ACOES = [
    { value: 'LOGIN', label: 'Login' },
    { value: 'SOLICITACAO_CRIADA', label: 'Solicitação criada' },
    { value: 'SOLICITACAO_EMITIDA', label: 'Nota emitida' },
    { value: 'NOTA_ENVIADA', label: 'Nota enviada' },
    { value: 'USUARIO_CRIADO', label: 'Usuário criado' },
    { value: 'USUARIO_EDITADO', label: 'Usuário editado' },
    { value: 'USUARIO_DESATIVADO', label: 'Usuário desativado' },
];

export const AuditoriaFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [local, setLocal] = useState({
        usuario: searchParams.get('usuario') ?? '',
        acao: searchParams.get('acao') ?? '',
        periodo: searchParams.get('periodo') ?? '',
    });

    const push = (overrides: Partial<typeof local>) => {
        const next = { ...local, ...overrides };
        const params = new URLSearchParams();
        if (next.usuario) params.set('usuario', next.usuario);
        if (next.acao) params.set('acao', next.acao);
        if (next.periodo) params.set('periodo', next.periodo);
        router.replace(`?${params.toString()}`);
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        push({});
    };

    const handleSelectChange = (key: 'acao' | 'periodo', value: string) => {
        const v = value === 'todos' || value === 'todas' ? '' : value;
        setLocal((f) => ({ ...f, [key]: v }));
        push({ [key]: v });
    };

    const handleLimpar = () => {
        setLocal({ usuario: '', acao: '', periodo: '' });
        router.replace('?');
    };

    const temFiltro = local.usuario || local.acao || local.periodo;

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
            <Input
                placeholder="Filtrar por usuário"
                value={local.usuario}
                onChange={(e) => setLocal((f) => ({ ...f, usuario: e.target.value }))}
                className="w-52"
            />

            <Select
                value={local.acao || 'todas'}
                onValueChange={(v) => handleSelectChange('acao', v)}
            >
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todas">Todas as ações</SelectItem>
                    {ACOES.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={local.periodo || 'todos'}
                onValueChange={(v) => handleSelectChange('periodo', v)}
            >
                <SelectTrigger className="w-44">
                    <SelectValue placeholder="Qualquer período" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos">Qualquer período</SelectItem>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                </SelectContent>
            </Select>

            <Button type="submit" variant="outline">
                Filtrar
            </Button>

            {temFiltro && (
                <Button type="button" variant="ghost" onClick={handleLimpar}>
                    Limpar
                </Button>
            )}
        </form>
    );
};
