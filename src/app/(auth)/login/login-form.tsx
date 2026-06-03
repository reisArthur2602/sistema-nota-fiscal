'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

const loginSchema = z.object({
    usuario: z.string().min(3, 'Informe seu nome de usuario.'),
    senha: z.string().min(6, 'A senha deve ter no minimo 6 caracteres.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { usuario: '', senha: '' },
    });

    const onSubmit = async (_data: LoginFormData) => {};

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field>
                <FieldLabel htmlFor="usuario">Nome de usuario</FieldLabel>
                <Input
                    id="usuario"
                    type="text"
                    placeholder="nome.sobrenome"
                    autoComplete="username"
                    {...form.register('usuario')}
                />
                <FieldError errors={[form.formState.errors.usuario]} />
            </Field>

            <Field>
                <FieldLabel htmlFor="senha">Senha</FieldLabel>
                <div className="relative">
                    <Input
                        id="senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="pr-10"
                        {...form.register('senha')}
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
                <FieldError errors={[form.formState.errors.senha]} />
            </Field>

            <Button type="submit" className="mt-1 w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <>
                        <Spinner />
                        Entrando...
                    </>
                ) : (
                    'Entrar'
                )}
            </Button>
        </form>
    );
};
