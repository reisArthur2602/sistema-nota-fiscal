'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type PropsWithChildren, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

import { criarUsuario, editarUsuario } from './actions';
import type { UsuarioRow } from './equipe-table';

const usuarioSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório.'),
    usuario: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres.'),
    senha: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'RECEPCAO', 'EMISSOR']),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

type Props = PropsWithChildren<{
    usuario?: UsuarioRow;
}>;

export const UsuarioDialog = ({ children, usuario }: Props) => {
    const [open, setOpen] = useState(false);

    const editando = !!usuario;

    const defaultValues = {
        nome: usuario?.nome ?? '',
        usuario: usuario?.usuario ?? '',
        senha: '',
        role: (usuario?.role ?? 'RECEPCAO') as UsuarioFormData['role'],
    };

    const form = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
        defaultValues,
    });

    const handleOpenChange = (v: boolean) => {
        if (!v) form.reset(defaultValues);
        setOpen(v);
    };

    const onSubmit = async (data: UsuarioFormData) => {
        if (!editando && (!data.senha || data.senha.length < 6)) {
            form.setError('senha', { message: 'A senha deve ter no mínimo 6 caracteres.' });
            return;
        }

        const resultado = editando
            ? await editarUsuario(usuario.id, data)
            : await criarUsuario(data);

        if (!resultado.success) {
            toast.error(resultado.message);
            return;
        }

        toast.success(resultado.message);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{editando ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
                        <DialogDescription>
                            {editando
                                ? 'Atualize os dados do usuário.'
                                : 'Preencha os dados para criar um novo usuário.'}
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="py-4">
                        <Field>
                            <FieldLabel htmlFor="nome">Nome</FieldLabel>
                            <Input
                                id="nome"
                                placeholder="Nome completo"
                                {...form.register('nome')}
                            />
                            <FieldError errors={[form.formState.errors.nome]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="usuario">Nome de usuário</FieldLabel>
                            <Input
                                id="usuario"
                                type="text"
                                placeholder="nome.sobrenome"
                                {...form.register('usuario')}
                            />
                            <FieldError errors={[form.formState.errors.usuario]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="senha">Senha</FieldLabel>
                            <Input
                                id="senha"
                                type="password"
                                placeholder="••••••••"
                                {...form.register('senha')}
                            />
                            {editando && (
                                <FieldDescription>
                                    Deixe em branco para não alterar.
                                </FieldDescription>
                            )}
                            <FieldError errors={[form.formState.errors.senha]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="role">Perfil</FieldLabel>
                            <Controller
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="role" className="w-full">
                                            <SelectValue placeholder="Selecione um perfil" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                            <SelectItem value="RECEPCAO">Recepção</SelectItem>
                                            <SelectItem value="EMISSOR">Emissor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[form.formState.errors.role]} />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Spinner />}
                            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
