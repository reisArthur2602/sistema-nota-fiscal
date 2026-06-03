import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { listarUltimasSolicitacoes } from './actions';
import { SolicitacaoForm } from './solicitacao-form';

export const metadata: Metadata = {
    title: 'Solicitações',
};

const statusConfig: Record<string, { label: string; className: string }> = {
    PENDENTE: {
        label: 'Pendente',
        className: 'border-border bg-transparent text-muted-foreground',
    },
    EMITIDA: {
        label: 'Emitida',
        className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    ENVIADA_AO_PACIENTE: {
        label: 'Enviada',
        className: 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400',
    },
};

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

const SolicitacaoPage = async () => {
    const solicitacoes = await listarUltimasSolicitacoes();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Solicitações</h1>
                <p className="text-sm text-muted-foreground">
                    Crie e acompanhe as solicitações de nota fiscal
                </p>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[400px_1fr]">
                <div className="space-y-3">
                    <p className="text-sm font-medium">Nova Solicitação</p>
                    <SolicitacaoForm />
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-medium">Últimas Solicitações</p>
                    <div className="overflow-hidden rounded-2xl border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Registro</TableHead>
                                    <TableHead>Paciente</TableHead>
                                    <TableHead>Especialidade</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {solicitacoes.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center text-sm text-muted-foreground"
                                        >
                                            Nenhuma solicitação encontrada.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    solicitacoes.map((s) => {
                                        const status = statusConfig[s.status] ?? {
                                            label: s.status,
                                            className: 'border-border text-muted-foreground',
                                        };
                                        return (
                                            <TableRow key={s.id}>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {s.idRegistro}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium">{s.nome}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {s.cpf}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="max-w-40 truncate text-muted-foreground">
                                                    {s.especialidade}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formatDate(s.data)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={status.className}>
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolicitacaoPage;
