import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { listarLogs } from './actions';
import { AuditoriaFilters } from './auditoria-filters';

type Props = {
    usuario?: string;
    acao?: string;
    periodo?: string;
};

const acaoConfig: Record<string, { label: string; className: string }> = {
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
    date.toLocaleString('pt-BR', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

export const AuditoriaContent = async ({ usuario, acao, periodo }: Props) => {
    const logs = await listarLogs({ usuario, acao, periodo });

    return (
        <>
            <AuditoriaFilters usuario={usuario} acao={acao} periodo={periodo} />

            <div className="overflow-hidden rounded-2xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data / Hora</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    Nenhum registro encontrado para os filtros aplicados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => {
                                const config = acaoConfig[log.acao] ?? {
                                    label: log.acao,
                                    className: 'border-border text-muted-foreground',
                                };
                                return (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                            {formatDateTime(log.criadoEm)}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{log.usuarioNome}</p>
                                            <p className="text-xs text-muted-foreground">
                                                @{log.usuarioLogin}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={config.className}>
                                                {config.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {log.detalhes}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};
