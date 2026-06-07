'use client';

import { createColumnHelper } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { describeLog, logLabel, logVariant } from '@/utils/log-format';

export type LogRow = {
    id: string;
    tipo: string;
    detalhes: unknown;
    criadoEm: Date | string;
    usuario: { nome: string } | null;
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
        cell: (info) => (
            <Badge variant={logVariant(info.getValue())}>{logLabel(info.getValue())}</Badge>
        ),
    }),
    columnHelper.accessor('usuario', {
        header: 'Usuário',
        cell: (info) => (
            <span className="text-sm text-foreground">
                {info.getValue()?.nome ?? <span className="text-muted-foreground">Sistema</span>}
            </span>
        ),
    }),
    columnHelper.accessor('detalhes', {
        header: 'Descrição',
        cell: (info) => (
            <span className="text-sm text-muted-foreground">
                {describeLog(info.row.original.tipo, info.getValue())}
            </span>
        ),
    }),
];
