'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

export type LogRow = {
    id: string;
    tipo: string;
    ip: string | null;
    detalhes: unknown;
    criadoEm: Date | string;
    usuario: { nome: string } | null;
};

const TIPO_CONFIG: Record<string, { label: string; className: string }> = {
    LOGIN: { label: 'Login', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    LOGOUT: { label: 'Logout', className: 'bg-slate-50 text-slate-600 border-slate-200' },
    UPLOAD_EXAME: { label: 'Upload de exame', className: 'bg-primary/10 text-primary border-primary/20' },
    REATIVAR_EXAME: { label: 'Reativação', className: 'bg-green-50 text-green-700 border-green-200' },
    INATIVAR_EXAME: { label: 'Inativação', className: 'bg-red-50 text-red-700 border-red-200' },
    DOWNLOAD_RESULTADO: { label: 'Download', className: 'bg-purple-50 text-purple-700 border-purple-200' },
    CRIAR_USUARIO: { label: 'Criar usuário', className: 'bg-primary/10 text-primary border-primary/20' },
    EDITAR_USUARIO: { label: 'Editar usuário', className: 'bg-orange-50 text-orange-700 border-orange-200' },
    ATIVAR_USUARIO: { label: 'Ativar usuário', className: 'bg-green-50 text-green-700 border-green-200' },
    INATIVAR_USUARIO: { label: 'Inativar usuário', className: 'bg-red-50 text-red-700 border-red-200' },
};

const formatDateTime = (date: Date | string) =>
    new Date(date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo',
    });

const columnHelper = createColumnHelper<LogRow>();

export const auditoriaColumns = [
    columnHelper.accessor('criadoEm', {
        header: 'Data / hora',
        cell: (info) => (
            <span className="text-sm text-muted-foreground whitespace-nowrap font-mono">
                {formatDateTime(info.getValue())}
            </span>
        ),
    }),
    columnHelper.accessor('tipo', {
        header: 'Ação',
        cell: (info) => {
            const config = TIPO_CONFIG[info.getValue()];
            return (
                <Badge
                    variant="outline"
                    className={config?.className ?? 'bg-muted text-muted-foreground'}
                >
                    {config?.label ?? info.getValue()}
                </Badge>
            );
        },
    }),
    columnHelper.accessor('usuario', {
        header: 'Usuário',
        cell: (info) => (
            <span className="text-sm text-foreground">
                {info.getValue()?.nome ?? <span className="text-muted-foreground">—</span>}
            </span>
        ),
    }),
    columnHelper.accessor('ip', {
        header: 'IP',
        cell: (info) => (
            <span className="text-xs text-muted-foreground font-mono">
                {info.getValue() ?? '—'}
            </span>
        ),
    }),
    columnHelper.accessor('detalhes', {
        header: 'Detalhes',
        cell: (info) => {
            const raw = info.getValue();
            if (!raw) return <span className="text-muted-foreground text-sm">—</span>;
            const text = JSON.stringify(raw);
            return (
                <span
                    className="text-xs text-muted-foreground font-mono max-w-xs truncate block"
                    title={text}
                >
                    {text.length > 60 ? text.slice(0, 60) + '…' : text}
                </span>
            );
        },
    }),
];
