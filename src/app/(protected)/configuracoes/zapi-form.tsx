'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Eye,
    EyeOff,
    Loader2,
    RefreshCw,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import {
    saveZapiConfigAction,
    testZapiConnectionAction,
    type ZapiConfig,
} from './actions';

const schema = z.object({
    instanceId: z.string().min(1, 'Instance ID é obrigatório.'),
    token: z.string().min(1, 'Token é obrigatório.'),
    clientToken: z.string().min(1, 'Client Token é obrigatório.'),
    mensagem: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres.'),
    ativo: z.boolean(),
});

type FormData = z.infer<typeof schema>;

type TestResult = { success: boolean; message: string } | null;

export const ZapiForm = ({ config }: { config: ZapiConfig }) => {
    const [showToken, setShowToken] = useState(false);
    const [showClientToken, setShowClientToken] = useState(false);
    const [testResult, setTestResult] = useState<TestResult>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: config,
    });

    const saveMutation = useMutation({
        mutationFn: (data: FormData) => saveZapiConfigAction(data),
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        },
    });

    const testMutation = useMutation({
        mutationFn: testZapiConnectionAction,
        onSuccess: (data) => {
            setTestResult(data);
        },
    });

    const ativo = form.watch('ativo');

    return (
        <div className="space-y-6">
            {/* Status da integração */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                'size-10 rounded-xl flex items-center justify-center',
                                ativo
                                    ? 'bg-green-500/10'
                                    : 'bg-muted-foreground/10',
                            )}
                        >
                            {ativo ? (
                                <Wifi className="size-5 text-green-500" />
                            ) : (
                                <WifiOff className="size-5 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Integração Z-API
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {ativo
                                    ? 'Habilitada — envio de mensagens WhatsApp ativo'
                                    : 'Desabilitada — nenhuma mensagem será enviada'}
                            </p>
                        </div>
                    </div>

                    {/* Toggle ativo */}
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

            {/* Formulário de credenciais */}
            <form
                onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))}
                className="space-y-6"
            >
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">Credenciais</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                        Encontre esses dados no painel da Z-API em{' '}
                        <a
                            href="https://app.z-api.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                            app.z-api.io
                            <ExternalLink className="size-3" />
                        </a>
                    </p>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="instanceId">Instance ID</FieldLabel>
                            <Input
                                id="instanceId"
                                placeholder="Ex: 3A123B456C789D"
                                autoComplete="off"
                                {...form.register('instanceId')}
                            />
                            <FieldDescription>
                                Identificador único da sua instância Z-API.
                            </FieldDescription>
                            <FieldError errors={[form.formState.errors.instanceId]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="token">Token</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="token"
                                    type={showToken ? 'text' : 'password'}
                                    placeholder="Cole o token da instância aqui"
                                    autoComplete="off"
                                    className="pr-10"
                                    {...form.register('token')}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowToken((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showToken ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            <FieldDescription>
                                Token de autenticação da instância Z-API.
                            </FieldDescription>
                            <FieldError errors={[form.formState.errors.token]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="clientToken">Client Token</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="clientToken"
                                    type={showClientToken ? 'text' : 'password'}
                                    placeholder="Cole o Account Security Token aqui"
                                    autoComplete="off"
                                    className="pr-10"
                                    {...form.register('clientToken')}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowClientToken((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showClientToken ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            <FieldDescription>
                                Token de segurança da conta, enviado no header{' '}
                                <code className="font-mono text-xs bg-muted px-1 rounded">
                                    Client-Token
                                </code>{' '}
                                de todas as requisições.
                            </FieldDescription>
                            <FieldError errors={[form.formState.errors.clientToken]} />
                        </Field>
                    </FieldGroup>
                </div>

                <Separator />

                {/* Mensagem */}
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                        Modelo de mensagem
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                        Variáveis disponíveis:{' '}
                        {['{nome}', '{protocolo}', '{link}'].map((v) => (
                            <code
                                key={v}
                                className="mx-0.5 rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground"
                            >
                                {v}
                            </code>
                        ))}
                    </p>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="mensagem">Mensagem WhatsApp</FieldLabel>
                            <Textarea
                                id="mensagem"
                                rows={4}
                                placeholder="Olá, {nome}! Seu resultado está disponível em: {link}"
                                {...form.register('mensagem')}
                            />
                            <FieldError errors={[form.formState.errors.mensagem]} />
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
                        {saveMutation.isPending && (
                            <Loader2 className="size-4 animate-spin" />
                        )}
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
