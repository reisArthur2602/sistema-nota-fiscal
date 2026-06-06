'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    FolderOpen,
    Loader2,
    RefreshCw,
    Server,
    ServerOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { saveFtpConfigAction, testFtpConnectionAction, type FtpConfig } from './actions';

const schema = z.object({
    host: z.string().min(1, 'Host é obrigatório.'),
    porta: z.coerce
        .number({ invalid_type_error: 'Porta inválida.' })
        .int()
        .min(1)
        .max(65535, 'Porta deve estar entre 1 e 65535.'),
    usuario: z.string().min(1, 'Usuário é obrigatório.'),
    senha: z.string().min(1, 'Senha é obrigatória.'),
    caminho: z.string().min(1, 'Caminho é obrigatório.'),
    ativo: z.boolean(),
});

type FormData = z.infer<typeof schema>;
type TestResult = { success: boolean; message: string } | null;

export const FtpForm = ({ config }: { config: FtpConfig }) => {
    const [showSenha, setShowSenha] = useState(false);
    const [testResult, setTestResult] = useState<TestResult>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: config,
    });

    const saveMutation = useMutation({
        mutationFn: (data: FormData) => saveFtpConfigAction(data),
        onSuccess: (data) => {
            if (data.success) toast.success(data.message);
            else toast.error(data.message);
        },
    });

    const testMutation = useMutation({
        mutationFn: testFtpConnectionAction,
        onSuccess: (data) => setTestResult(data),
    });

    const ativo = form.watch('ativo');

    return (
        <div className="space-y-6">
            {/* Status */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                'size-10 rounded-xl flex items-center justify-center',
                                ativo ? 'bg-blue-500/10' : 'bg-muted-foreground/10',
                            )}
                        >
                            {ativo ? (
                                <Server className="size-5 text-blue-500" />
                            ) : (
                                <ServerOff className="size-5 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Servidor FTP</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {ativo
                                    ? 'Habilitado — arquivos salvos diretamente no servidor FTP'
                                    : 'Desabilitado — arquivos salvos localmente (UPLOAD_DIR)'}
                            </p>
                        </div>
                    </div>

                    <Controller
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                            <button
                                type="button"
                                role="switch"
                                aria-checked={field.value}
                                onClick={() => field.onChange(!field.value)}
                                className={cn(
                                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                    field.value ? 'bg-primary' : 'bg-muted-foreground/30',
                                )}
                            >
                                <span
                                    className={cn(
                                        'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg transition-transform duration-200',
                                        field.value ? 'translate-x-5' : 'translate-x-0',
                                    )}
                                />
                            </button>
                        )}
                    />
                </div>
            </div>

            <form
                onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))}
                className="space-y-6"
            >
                {/* Servidor */}
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">Conexão</h3>
                    <FieldGroup>
                        <div className="grid grid-cols-3 gap-4">
                            <Field className="col-span-2">
                                <FieldLabel htmlFor="host">Host</FieldLabel>
                                <Input
                                    id="host"
                                    placeholder="ftp.clinica.com.br ou 192.168.1.10"
                                    autoComplete="off"
                                    {...form.register('host')}
                                />
                                <FieldError errors={[form.formState.errors.host]} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="porta">Porta</FieldLabel>
                                <Input
                                    id="porta"
                                    type="number"
                                    min={1}
                                    max={65535}
                                    placeholder="21"
                                    {...form.register('porta')}
                                />
                                <FieldError errors={[form.formState.errors.porta]} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="usuario">Usuário</FieldLabel>
                                <Input
                                    id="usuario"
                                    placeholder="ftp_user"
                                    autoComplete="off"
                                    {...form.register('usuario')}
                                />
                                <FieldError errors={[form.formState.errors.usuario]} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="senha">Senha</FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="senha"
                                        type={showSenha ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        autoComplete="off"
                                        className="pr-10"
                                        {...form.register('senha')}
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowSenha((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showSenha ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                <FieldError errors={[form.formState.errors.senha]} />
                            </Field>
                        </div>
                    </FieldGroup>
                </div>

                <Separator />

                {/* Caminho */}
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                        Diretório de destino
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                        Caminho remoto no servidor FTP onde os PDFs de exames serão salvos.
                    </p>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="caminho">
                                <FolderOpen className="size-3.5" />
                                Caminho remoto
                            </FieldLabel>
                            <Input
                                id="caminho"
                                placeholder="/uploads/exames"
                                autoComplete="off"
                                {...form.register('caminho')}
                            />
                            <FieldDescription>
                                Use caminhos absolutos. Ex: <code className="font-mono text-xs bg-muted px-1 rounded">/var/www/uploads/exames</code>
                            </FieldDescription>
                            <FieldError errors={[form.formState.errors.caminho]} />
                        </Field>
                    </FieldGroup>
                </div>

                {/* Resultado do teste */}
                {testResult && (
                    <div
                        className={cn(
                            'flex items-start gap-3 rounded-xl border p-4 text-sm',
                            testResult.success
                                ? 'border-green-500/20 bg-green-500/5 text-green-400'
                                : 'border-destructive/20 bg-destructive/5 text-destructive',
                        )}
                    >
                        {testResult.success ? (
                            <CheckCircle className="size-4 shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        )}
                        <p>{testResult.message}</p>
                    </div>
                )}

                {/* Ações */}
                <div className="flex items-center gap-3 flex-wrap pt-2">
                    <Button type="submit" disabled={saveMutation.isPending}>
                        {saveMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                        {saveMutation.isPending ? 'Salvando...' : 'Salvar configurações'}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={testMutation.isPending}
                        onClick={() => {
                            setTestResult(null);
                            testMutation.mutate();
                        }}
                    >
                        {testMutation.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <RefreshCw className="size-4" />
                        )}
                        {testMutation.isPending ? 'Testando...' : 'Testar conexão'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
