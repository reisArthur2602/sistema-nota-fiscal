'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { buildMensagem } from '@/utils/build-message';
import { formatDate } from '@/utils/format-date';
import { enviarNota } from './actions';

export type Solicitacao = {
    id: string;
    idRegistro: string;
    nome: string;
    cpf: string;
    endereco: string;
    especialidade: string;
    valor?: string;
    data: string;
    email?: string;
    telefone?: string;
    status: string;
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

const enviarNotaSchema = z.object({
    linkNota: z.string().url('Informe uma URL válida.'),
});

type EnviarNotaData = z.infer<typeof enviarNotaSchema>;

export const EmissorTable = ({ solicitacoes }: { solicitacoes: Solicitacao[] }) => {
    const [verSolicitacao, setVerSolicitacao] = useState<Solicitacao | null>(null);
    const [enviarSolicitacao, setEnviarSolicitacao] = useState<Solicitacao | null>(null);

    const form = useForm<EnviarNotaData>({
        resolver: zodResolver(enviarNotaSchema),
        defaultValues: { linkNota: '' },
    });

    const linkNota = form.watch('linkNota');

    const handleEnviarClose = (open: boolean) => {
        if (!open) {
            form.reset();
            setEnviarSolicitacao(null);
        }
    };

    const onEnviar = async (data: EnviarNotaData) => {
        if (!enviarSolicitacao) return;
        const resultado = await enviarNota(enviarSolicitacao.id, data.linkNota);
        if (!resultado.success) {
            toast.error(resultado.message);
            return;
        }
        toast.success(resultado.message);
        form.reset();
        setEnviarSolicitacao(null);
    };

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
                                const st = statusConfig[s.status] ?? {
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

            {/* Dialog: Ver detalhes */}
            <Dialog
                open={!!verSolicitacao}
                onOpenChange={(open) => !open && setVerSolicitacao(null)}
            >
                {verSolicitacao && (
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Detalhes da Solicitação</DialogTitle>
                            <DialogDescription>
                                Registro #{verSolicitacao.idRegistro}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-1 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Data</p>
                                    <p>{formatDate(verSolicitacao.data)}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <Badge
                                        className={
                                            (
                                                statusConfig[verSolicitacao.status] ??
                                                statusConfig.PENDENTE
                                            ).className
                                        }
                                    >
                                        {
                                            (
                                                statusConfig[verSolicitacao.status] ??
                                                statusConfig.PENDENTE
                                            ).label
                                        }
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Nome</p>
                                    <p className="font-medium">{verSolicitacao.nome}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">CPF</p>
                                        <p>{verSolicitacao.cpf}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">Telefone</p>
                                        <p>{verSolicitacao.telefone || '—'}</p>
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">E-mail</p>
                                    <p>{verSolicitacao.email || '—'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-muted-foreground">Endereço</p>
                                    <p>{verSolicitacao.endereco}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-0.5">
                                <p className="text-xs text-muted-foreground">Especialidade</p>
                                <p className="font-medium">{verSolicitacao.especialidade}</p>
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

            {/* Dialog: Enviar nota */}
            <Dialog open={!!enviarSolicitacao} onOpenChange={handleEnviarClose}>
                {enviarSolicitacao && (
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={form.handleSubmit(onEnviar)}>
                            <DialogHeader>
                                <DialogTitle>Enviar Nota Fiscal</DialogTitle>
                                <DialogDescription>
                                    {enviarSolicitacao.nome} — {enviarSolicitacao.especialidade}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <Field>
                                    <FieldLabel htmlFor="linkNota">Link da nota fiscal</FieldLabel>
                                    <Input
                                        id="linkNota"
                                        type="url"
                                        placeholder="https://..."
                                        autoComplete="off"
                                        {...form.register('linkNota')}
                                    />
                                    <FieldError errors={[form.formState.errors.linkNota]} />
                                </Field>

                                {linkNota && (
                                    <div className="space-y-1.5">
                                        <p className="text-xs text-muted-foreground">
                                            Pré-visualização da mensagem
                                        </p>
                                        <pre className="whitespace-pre-wrap rounded-xl bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                                            {buildMensagem(enviarSolicitacao, linkNota)}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Spinner />}
                                    {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
};
