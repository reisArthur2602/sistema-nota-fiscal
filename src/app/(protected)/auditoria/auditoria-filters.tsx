'use client';

import { useRouter } from 'next/navigation';
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

type Props = {
    usuario?: string;
    acao?: string;
    periodo?: string;
};

const ACOES = [
    { value: 'LOGIN', label: 'Login' },
    { value: 'SOLICITACAO_CRIADA', label: 'Solicitação criada' },
    { value: 'SOLICITACAO_EMITIDA', label: 'Nota emitida' },
    { value: 'NOTA_ENVIADA', label: 'Nota enviada' },
    { value: 'USUARIO_CRIADO', label: 'Usuário criado' },
    { value: 'USUARIO_EDITADO', label: 'Usuário editado' },
    { value: 'USUARIO_DESATIVADO', label: 'Usuário desativado' },
];

export const AuditoriaFilters = ({ usuario = '', acao = '', periodo = '' }: Props) => {
    const router = useRouter();
    const [filtros, setFiltros] = useState({ usuario, acao, periodo });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (filtros.usuario) params.set('usuario', filtros.usuario);
        if (filtros.acao) params.set('acao', filtros.acao);
        if (filtros.periodo) params.set('periodo', filtros.periodo);
        router.replace(`?${params.toString()}`);
    };

    const handleLimpar = () => {
        setFiltros({ usuario: '', acao: '', periodo: '' });
        router.replace('?');
    };

    const temFiltro = filtros.usuario || filtros.acao || filtros.periodo;

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
            <Input
                placeholder="Filtrar por usuário"
                value={filtros.usuario}
                onChange={(e) => setFiltros((f) => ({ ...f, usuario: e.target.value }))}
                className="w-52"
            />

            <Select
                value={filtros.acao}
                onValueChange={(v) => setFiltros((f) => ({ ...f, acao: v === 'todas' ? '' : v }))}
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
                value={filtros.periodo}
                onValueChange={(v) => setFiltros((f) => ({ ...f, periodo: v === 'todos' ? '' : v }))}
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
