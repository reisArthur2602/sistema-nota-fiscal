'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { loginAction } from './actions';

const loginSchema = z.object({
    usuario: z.string().min(1, 'Informe o usuário.'),
    senha: z.string().min(1, 'Informe a senha.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const router = useRouter();
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { usuario: '', senha: '' },
    });

    const mutation = useMutation({
        mutationFn: loginAction,
        onSuccess: (data) => {
            if (data.success) {
                router.push('/upload');
            }
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };

    const errorMessage =
        mutation.data && !mutation.data.success ? mutation.data.message : null;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="usuario">Usuário</FieldLabel>
                    <Input
                        id="usuario"
                        type="text"
                        placeholder="Digite seu usuário"
                        autoComplete="username"
                        autoFocus
                        {...form.register('usuario')}
                    />
                    <FieldError errors={[form.formState.errors.usuario]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="senha">Senha</FieldLabel>
                    <div className="relative">
                        <Input
                            id="senha"
                            type={mostrarSenha ? 'text' : 'password'}
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            className="pr-10"
                            {...form.register('senha')}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                        >
                            {mostrarSenha ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                    <FieldError errors={[form.formState.errors.senha]} />
                </Field>

                {errorMessage && (
                    <p className="text-sm text-destructive">{errorMessage}</p>
                )}

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
                    {mutation.isPending ? 'Entrando...' : 'Entrar'}
                </Button>
            </FieldGroup>
        </form>
    );
};
