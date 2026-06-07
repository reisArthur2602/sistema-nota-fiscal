'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { criarUsuarioAction, editarUsuarioAction } from './actions';

export type UsuarioEditData = {
    id: string;
    nome: string;
    usuario: string;
    role: 'SUPER_ADMIN' | 'LAUDO';
};

type FormData = {
    nome: string;
    usuario: string;
    role: 'SUPER_ADMIN' | 'LAUDO';
    senha: string;
    confirmarSenha: string;
};

const gerarUsuario = (nome: string) =>
    slugify(nome, {
        lower: true,
        replacement: '.',
        locale: 'pt',
    });

const baseSchema = z.object({
    nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.').max(80, 'Nome muito longo.'),
    usuario: z
        .string()
        .min(3, 'Usuário deve ter ao menos 3 caracteres.')
        .max(30, 'Usuário muito longo.'),

    role: z.enum(['SUPER_ADMIN', 'LAUDO']),
});

const createSchema = baseSchema
    .extend({
        senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
        confirmarSenha: z.string().min(1, 'Confirme a senha.'),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        message: 'As senhas não coincidem.',
        path: ['confirmarSenha'],
    });

const editSchema = baseSchema
    .extend({
        senha: z
            .string()
            .refine((v) => v === '' || v.length >= 6, 'Senha deve ter ao menos 6 caracteres.'),
        confirmarSenha: z.string(),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        message: 'As senhas não coincidem.',
        path: ['confirmarSenha'],
    });

export const UsuarioDialog = ({
    children,
    usuario,
}: PropsWithChildren<{ usuario?: UsuarioEditData }>) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const isEdit = !!usuario;

    const autoGen = useRef(!isEdit);

    const form = useForm<FormData>({
        resolver: zodResolver(isEdit ? editSchema : createSchema),
        defaultValues: {
            nome: usuario?.nome ?? '',
            usuario: usuario?.usuario ?? '',
            role: usuario?.role ?? 'LAUDO',
            senha: '',
            confirmarSenha: '',
        },
    });

    const nomeValue = form.watch('nome');

    useEffect(() => {
        form.setValue('usuario', gerarUsuario(nomeValue), {
            shouldValidate: form.formState.isSubmitted,
        });
    }, [nomeValue, form]);

    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (isEdit) {
                return editarUsuarioAction(usuario.id, {
                    nome: data.nome,
                    usuario: data.usuario,
                    role: data.role,
                    senha: data.senha || undefined,
                });
            }
            return criarUsuarioAction({
                nome: data.nome,
                usuario: data.usuario,
                role: data.role,
                senha: data.senha,
            });
        },
        onSuccess: (result) => {
            if (result.success) {
                setOpen(false);
                router.refresh();
            }
        },
    });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            setTimeout(() => {
                autoGen.current = !isEdit;
                form.reset({
                    nome: usuario?.nome ?? '',
                    usuario: usuario?.usuario ?? '',
                    role: usuario?.role ?? 'LAUDO',
                    senha: '',
                    confirmarSenha: '',
                });
                mutation.reset();
            }, 200);
        }
    };

    const errorMessage = mutation.data && !mutation.data.success ? mutation.data.message : null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Atualize os dados. Deixe a senha em branco para não alterá-la.'
                            : 'Preencha os dados para criar um novo usuário.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
                    <FieldGroup>
                        {/* Nome — linha inteira */}
                        <Field>
                            <FieldLabel htmlFor="u-nome">Nome</FieldLabel>
                            <Input
                                id="u-nome"
                                placeholder="Nome completo"
                                {...form.register('nome')}
                            />
                            <FieldError errors={[form.formState.errors.nome]} />
                        </Field>

                        {/* Usuário + Perfil — 2 colunas */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="u-usuario">Usuário</FieldLabel>
                                <Input
                                    id="u-usuario"
                                    placeholder="ex:. arthur.reis"
                                    readOnly
                                    tabIndex={-1}
                                    aria-readonly
                                    disabled
                                    {...form.register('usuario')}
                                />
                                <FieldError errors={[form.formState.errors.usuario]} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="u-role">Perfil</FieldLabel>
                                <Select
                                    value={form.watch('role')}
                                    onValueChange={(v) =>
                                        form.setValue('role', v as 'SUPER_ADMIN' | 'LAUDO', {
                                            shouldValidate: true,
                                        })
                                    }
                                >
                                    <SelectTrigger id="u-role">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LAUDO">Laudo</SelectItem>
                                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError errors={[form.formState.errors.role]} />
                            </Field>
                        </div>

                        {/* Senha + Confirmar — 2 colunas */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="u-senha">
                                    {isEdit ? 'Nova senha' : 'Senha'}
                                </FieldLabel>
                                <Input
                                    id="u-senha"
                                    type="password"
                                    placeholder={isEdit ? 'Opcional' : 'Mínimo 6 caracteres'}
                                    {...form.register('senha')}
                                />
                                <FieldError errors={[form.formState.errors.senha]} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="u-confirmar-senha">
                                    {isEdit ? 'Confirmar nova senha' : 'Confirmar senha'}
                                </FieldLabel>
                                <Input
                                    id="u-confirmar-senha"
                                    type="password"
                                    placeholder={isEdit ? 'Opcional' : 'Repita a senha'}
                                    {...form.register('confirmarSenha')}
                                />
                                <FieldError errors={[form.formState.errors.confirmarSenha]} />
                            </Field>
                        </div>

                        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? 'Salvando...'
                                : isEdit
                                  ? 'Salvar alterações'
                                  : 'Criar usuário'}
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};
