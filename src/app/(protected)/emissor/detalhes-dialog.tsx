'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { StatusSolicitacao } from '@/generated/prisma/enums';
import { formatDate } from '@/utils/format-date';

import type { SolicitacaoRow } from './emissor-table';

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

type Props = {
    solicitacao: SolicitacaoRow | null;
    onClose: () => void;
};

export const DetalhesDialog = ({ solicitacao, onClose }: Props) => {
    return (
        <Dialog open={!!solicitacao} onOpenChange={(open) => !open && onClose()}>
            {solicitacao && (
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Solicitação</DialogTitle>
                        <DialogDescription>Registro #{solicitacao.idRegistro}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-1 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-0.5">
                                <p className="text-xs text-muted-foreground">Data</p>
                                <p>{formatDate(solicitacao.data)}</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs text-muted-foreground">Status</p>
                                <Badge className={statusConfig[solicitacao.status].className}>
                                    {statusConfig[solicitacao.status].label}
                                </Badge>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="space-y-0.5">
                                <p className="text-xs text-muted-foreground">Nome</p>
                                <p className="font-medium">{solicitacao.nome}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">CPF</p>
                                    <p>{solicitacao.cpf}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Telefone</p>
                                    <p>{solicitacao.telefone || '—'}</p>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs text-muted-foreground">E-mail</p>
                                <p>{solicitacao.email || '—'}</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs text-muted-foreground">Endereço</p>
                                <p>{solicitacao.endereco}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">Especialidade</p>
                            <p className="font-medium">{solicitacao.especialidade}</p>
                        </div>

                        <Separator />

                        <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">Solicitado por</p>
                            <p className="font-medium">{solicitacao.criadoPor.nome}</p>
                            <p className="text-xs text-muted-foreground">
                                @{solicitacao.criadoPor.usuario}
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Fechar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
};
