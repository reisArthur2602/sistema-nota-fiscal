'use client';

import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { StatusSolicitacao } from '@/generated/prisma/enums';
import type { Prisma } from '@/generated/prisma/client';
import { formatDate } from '@/utils/format-date';

import { DetalhesDialog } from './detalhes-dialog';
import { EnviarNotaDialog } from './enviar-nota-dialog';

export type SolicitacaoRow = Prisma.SolicitacaoGetPayload<{
    include: { criadoPor: { select: { nome: true; usuario: true } } };
}>;

const statusConfig: Record<StatusSolicitacao, { label: string; className: string }> = {
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

export const EmissorTable = ({ solicitacoes }: { solicitacoes: SolicitacaoRow[] }) => {
    const [verSolicitacao, setVerSolicitacao] = useState<SolicitacaoRow | null>(null);
    const [enviarSolicitacao, setEnviarSolicitacao] = useState<SolicitacaoRow | null>(null);

    return (
        <>
            <div className="overflow-hidden rounded-2xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Registro</TableHead>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Especialidade</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {solicitacoes.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    Nenhuma solicitação encontrada para este filtro.
                                </TableCell>
                            </TableRow>
                        ) : (
                            solicitacoes.map((s) => {
                                const st = statusConfig[s.status];
                                return (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {s.idRegistro}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{s.nome}</p>
                                            <p className="text-xs text-muted-foreground">{s.cpf}</p>
                                        </TableCell>
                                        <TableCell className="max-w-48 truncate text-muted-foreground">
                                            {s.especialidade}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatDate(s.data)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={st.className}>{st.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon-sm">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => setVerSolicitacao(s)}
                                                    >
                                                        Ver detalhes
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setEnviarSolicitacao(s)}
                                                    >
                                                        Enviar nota
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <DetalhesDialog
                solicitacao={verSolicitacao}
                onClose={() => setVerSolicitacao(null)}
            />

            <EnviarNotaDialog
                solicitacao={enviarSolicitacao}
                onClose={() => setEnviarSolicitacao(null)}
            />
        </>
    );
};
