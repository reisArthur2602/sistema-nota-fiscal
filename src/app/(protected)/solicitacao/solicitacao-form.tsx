'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { buscarRegistro } from '@/http/buscar-registro';
import { criarSolicitacao } from './actions';

const solicitacaoSchema = z.object({
    idRegistro: z.string().min(1, 'Informe o ID do registro.'),
    data: z.string().min(1, 'Data é obrigatória.'),
    nome: z.string().min(1, 'Nome é obrigatório.'),
    cpf: z.string().min(1, 'CPF é obrigatório.'),
    endereco: z.string().min(1, 'Endereço é obrigatório.'),
    especialidade: z.string().min(1, 'Especialidade é obrigatória.'),
    valor: z
        .string()
        .min(1, 'Valor é obrigatório.')
        .refine((v) => !isNaN(parseFloat(v.replace(',', '.'))), 'Informe um valor válido.'),
    email: z.string().refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'E-mail inválido.'),
    telefone: z.string(),
});

type SolicitacaoFormData = z.infer<typeof solicitacaoSchema>;

const isCelular = (tel: string) => tel.replace(/\D/g, '').length === 11;

export const SolicitacaoForm = () => {
    const [buscando, setBuscando] = useState(false);
    const [erroBusca, setErroBusca] = useState<string | null>(null);
    const [dialogAberto, setDialogAberto] = useState(false);
    const [emailBloqueado, setEmailBloqueado] = useState(false);
    const [telefoneBloqueado, setTelefoneBloqueado] = useState(false);

    const form = useForm<SolicitacaoFormData>({
        resolver: zodResolver(solicitacaoSchema),
        defaultValues: {
            idRegistro: '',
            data: '',
            nome: '',
            cpf: '',
            endereco: '',
            especialidade: '',
            valor: '',
            email: '',
            telefone: '',
        },
    });

    const handleBuscar = async () => {
        const idRegistro = form.getValues('idRegistro').trim();

        if (!idRegistro) {
            form.setError('idRegistro', { message: 'Informe o ID do registro.' });
            return;
        }

        setBuscando(true);
        setErroBusca(null);

        const resultado = await buscarRegistro(idRegistro);

        setBuscando(false);

        if (!resultado.success) {
            setErroBusca(resultado.message);
            return;
        }

        const { data } = resultado;

        form.setValue('nome', data.nome, { shouldValidate: true });
        form.setValue('cpf', data.cpf, { shouldValidate: true });
        form.setValue('endereco', data.endereco, { shouldValidate: true });
        form.setValue('especialidade', data.especialidade, { shouldValidate: true });
        form.setValue('data', new Date(data.data).toISOString().split('T')[0], {
            shouldValidate: true,
        });
        if (data.email) {
            form.setValue('email', data.email);
            setEmailBloqueado(true);
        } else {
            setEmailBloqueado(false);
        }

        if (data.telefone && isCelular(data.telefone)) {
            form.setValue('telefone', data.telefone);
            setTelefoneBloqueado(true);
        } else {
            form.setValue('telefone', '');
            setTelefoneBloqueado(false);
        }

        setDialogAberto(true);
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            const idRegistro = form.getValues('idRegistro');
            form.reset();
            form.setValue('idRegistro', idRegistro);
            setErroBusca(null);
            setEmailBloqueado(false);
            setTelefoneBloqueado(false);
        }
        setDialogAberto(open);
    };

    const onSubmit = async (formData: SolicitacaoFormData) => {
        const resultado = await criarSolicitacao(formData);

        if (!resultado.success) {
            toast.error(resultado.message);
            return;
        }

        toast.success(resultado.message);
        form.reset();
        setDialogAberto(false);
    };

    return (
        <div>
            <div className="rounded-2xl border bg-card p-5">
                <Field>
                    <FieldLabel htmlFor="idRegistro" className="mb-1.5 text-sm">
                        ID do Registro
                    </FieldLabel>
                    <div className="flex gap-2">
                        <Input
                            id="idRegistro"
                            placeholder="Ex: 123456"
                            autoComplete="off"
                            className="flex-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleBuscar();
                                }
                            }}
                            {...form.register('idRegistro')}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBuscar}
                            disabled={buscando}
                            className="shrink-0"
                        >
                            {buscando ? <Spinner /> : <Search className="size-4" />}
                            {buscando ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </div>
                    <FieldError errors={[form.formState.errors.idRegistro]} />
                    {erroBusca && <FieldError>{erroBusca}</FieldError>}
                </Field>
            </div>

            <Dialog open={dialogAberto} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Dados do Paciente / Cliente</DialogTitle>
                            <DialogDescription>
                                Confira os dados e preencha e-mail e telefone se necessário.
                            </DialogDescription>
                        </DialogHeader>

                        <FieldGroup className="py-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="data">Data</FieldLabel>
                                    <Input
                                        id="data"
                                        type="date"
                                        readOnly
                                        disabled
                                        {...form.register('data')}
                                    />
                                    <FieldError errors={[form.formState.errors.data]} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="nome">Nome</FieldLabel>
                                    <Input id="nome" readOnly disabled {...form.register('nome')} />
                                    <FieldError errors={[form.formState.errors.nome]} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                                    <Input id="cpf" readOnly disabled {...form.register('cpf')} />
                                    <FieldError errors={[form.formState.errors.cpf]} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="endereco">Endereço</FieldLabel>
                                    <Input
                                        id="endereco"
                                        readOnly
                                        disabled
                                        {...form.register('endereco')}
                                    />
                                    <FieldError errors={[form.formState.errors.endereco]} />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="especialidade">Especialidade</FieldLabel>
                                    <Input
                                        id="especialidade"
                                        readOnly
                                        disabled
                                        {...form.register('especialidade')}
                                    />
                                    <FieldError errors={[form.formState.errors.especialidade]} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="valor">Valor (R$)</FieldLabel>
                                    <Input
                                        id="valor"
                                        placeholder="0,00"
                                        {...form.register('valor')}
                                    />
                                    <FieldError errors={[form.formState.errors.valor]} />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@exemplo.com"
                                        readOnly={emailBloqueado}
                                        disabled={emailBloqueado}
                                        {...form.register('email')}
                                    />
                                    <FieldError errors={[form.formState.errors.email]} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                                    <Input
                                        id="telefone"
                                        placeholder="(00) 00000-0000"
                                        readOnly={telefoneBloqueado}
                                        disabled={telefoneBloqueado}
                                        {...form.register('telefone')}
                                    />
                                    <FieldError errors={[form.formState.errors.telefone]} />
                                </Field>
                            </div>
                        </FieldGroup>

                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Spinner />}
                                {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
