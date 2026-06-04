import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { StatusSolicitacao } from '@/generated/prisma/enums';

import { listarUltimasSolicitacoes } from './actions';

const statusConfig: Record<StatusSolicitacao, { label: string; className: string }> = {
    PENDENTE: { label: 'Pendente', className: 'border-border bg-transparent text-muted-foreground' },
    EMITIDA: {
        label: 'Emitida',
        className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    ENVIADA_AO_PACIENTE: {
        label: 'Enviada',
        className: 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400',
    },
};

const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

export const SolicitacoesRecentes = async () => {
    const solicitacoes = await listarUltimasSolicitacoes();

    return (
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
                        solicitacoes.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {s.idRegistro}
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{s.nome}</p>
                                    <p className="text-xs text-muted-foreground">{s.cpf}</p>
                                </TableCell>
                                <TableCell className="max-w-40 truncate text-muted-foreground">
                                    {s.especialidade}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {formatDate(s.data)}
                                </TableCell>
                                <TableCell>
                                    <Badge className={statusConfig[s.status].className}>
                                        {statusConfig[s.status].label}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
