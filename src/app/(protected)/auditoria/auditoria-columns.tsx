import { createColumnHelper } from '@tanstack/react-table';
import { AcaoLog } from '@/generated/prisma/enums';

import { Badge } from '@/components/ui/badge';

export type LogRow = {
    id: string;
    usuarioNome: string;
    usuarioLogin: string;
    acao: AcaoLog;
    detalhes: string;
    criadoEm: Date;
};

const acaoConfig: Record<AcaoLog, { label: string; className: string }> = {
    LOGIN: { label: 'Login', className: 'border-border bg-transparent text-muted-foreground' },
    LOGOUT: { label: 'Logout', className: 'border-border bg-transparent text-muted-foreground' },
    SOLICITACAO_CRIADA: {
        label: 'Solicitação criada',
        className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    SOLICITACAO_EMITIDA: {
        label: 'Nota emitida',
        className: 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400',
    },
    NOTA_ENVIADA: {
        label: 'Nota enviada',
        className: 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400',
    },
    USUARIO_CRIADO: {
        label: 'Usuário criado',
        className: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    USUARIO_EDITADO: {
        label: 'Usuário editado',
        className: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    USUARIO_DESATIVADO: {
        label: 'Usuário desativado',
        className: 'border-destructive/20 bg-destructive/10 text-destructive',
    },
};

const formatDateTime = (date: Date) =>
    new Date(date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const columnHelper = createColumnHelper<LogRow>();

export const auditoriaColumns = [
    columnHelper.accessor('criadoEm', {
        header: 'Data / Hora',
        cell: (info) => (
            <span className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDateTime(info.getValue())}
            </span>
        ),
    }),
    columnHelper.accessor('usuarioNome', {
        header: 'Usuário',
        cell: (info) => (
            <>
                <p className="font-medium">{info.getValue()}</p>
                <p className="text-xs text-muted-foreground">@{info.row.original.usuarioLogin}</p>
            </>
        ),
    }),
    columnHelper.accessor('acao', {
        header: 'Ação',
        cell: (info) => {
            const cfg = acaoConfig[info.getValue()];
            return <Badge className={cfg.className}>{cfg.label}</Badge>;
        },
    }),
    columnHelper.accessor('detalhes', {
        header: 'Detalhes',
        cell: (info) => (
            <span className="text-sm text-muted-foreground">{info.getValue()}</span>
        ),
    }),
];
