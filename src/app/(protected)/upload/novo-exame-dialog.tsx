'use client';

import { type PropsWithChildren, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    CheckCircle,
    ClipboardCopy,
    FileText,
    Loader2,
    MessageCircle,
    PlusCircle,
    Upload,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
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

import { createExameAction } from './actions';

const MAX_SIZE = 10 * 1024 * 1024;

const formatCPFDisplay = (digits: string) => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

const formatPhoneDisplay = (digits: string) => {
    const d = digits.slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
};

const schema = z.object({
    cpf: z
        .string()
        .min(1, 'CPF é obrigatório.')
        .regex(/^\d{11}$/, 'CPF deve ter exatamente 11 dígitos numéricos.'),
    nomePaciente: z
        .string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres.')
        .max(120, 'Nome muito longo.'),
    protocolo: z.string().min(1, 'Protocolo é obrigatório.').max(50, 'Protocolo muito longo.'),
    telefone: z
        .string()
        .optional()
        .refine(
            (v) => !v || /^\d{10,11}$/.test(v.replace(/\D/g, '')),
            'Telefone deve ter 10 ou 11 dígitos.',
        ),
    arquivo: z
        .custom<FileList>((v) => v instanceof FileList)
        .refine((files) => files.length > 0, 'Selecione um arquivo PDF.')
        .refine((files) => files[0]?.type === 'application/pdf', 'Apenas arquivos PDF são aceitos.')
        .refine((files) => files[0]?.size <= MAX_SIZE, 'O arquivo deve ter no máximo 10 MB.'),
});

type FormData = z.infer<typeof schema>;

type Result = { link: string; nomePaciente: string; protocolo: string; whatsappEnviado: boolean };

const ExameForm = ({ onSuccess }: { onSuccess: (result: Result) => void }) => {
    const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { cpf: '', nomePaciente: '', protocolo: '', telefone: '' },
    });

    const { ref: cpfRef } = form.register('cpf');
    const { ref: telefoneRef } = form.register('telefone');
    const { onChange: onProtocoloChange, ...protocoloRegister } = form.register('protocolo');
    const { ref: fileRef, ...fileRegister } = form.register('arquivo');

    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            const fd = new FormData();
            fd.append('cpf', data.cpf);
            fd.append('nomePaciente', data.nomePaciente);
            fd.append('protocolo', data.protocolo);
            if (data.telefone) fd.append('telefone', data.telefone);
            fd.append('arquivo', data.arquivo[0]);
            return createExameAction(fd);
        },
        onSuccess: (data) => {
            if (data.success) {
                onSuccess({
                    link: data.link,
                    nomePaciente: data.nomePaciente,
                    protocolo: data.protocolo,
                    whatsappEnviado: data.whatsappEnviado,
                });
            }
        },
    });

    const errorMessage = mutation.data && !mutation.data.success ? mutation.data.message : null;

    return (
        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
            <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                        <Input
                            id="cpf"
                            name="cpf"
                            ref={cpfRef}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            value={formatCPFDisplay(form.watch('cpf') ?? '')}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                                form.setValue('cpf', digits, {
                                    shouldValidate: form.formState.isSubmitted,
                                });
                            }}
                        />
                        <FieldError errors={[form.formState.errors.cpf]} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="protocolo">Protocolo</FieldLabel>
                        <Input
                            id="protocolo"
                            placeholder="Ex: 2026456"
                            {...protocoloRegister}
                            onChange={(e) => {
                                e.target.value = e.target.value.toUpperCase();
                                void onProtocoloChange(e);
                            }}
                        />
                        <FieldError errors={[form.formState.errors.protocolo]} />
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="nomePaciente">Nome do paciente</FieldLabel>
                    <Input
                        id="nomePaciente"
                        placeholder="Nome completo"
                        {...form.register('nomePaciente')}
                    />
                    <FieldError errors={[form.formState.errors.nomePaciente]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="telefone">
                        WhatsApp{' '}
                        <span className="text-muted-foreground font-normal">(opcional)</span>
                    </FieldLabel>
                    <Input
                        id="telefone"
                        type="tel"
                        ref={telefoneRef}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                        value={formatPhoneDisplay(form.watch('telefone') ?? '')}
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                            form.setValue('telefone', digits, {
                                shouldValidate: form.formState.isSubmitted,
                            });
                        }}
                    />
                    <FieldError errors={[form.formState.errors.telefone]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="arquivo-dialog">Resultado em PDF</FieldLabel>
                    <label
                        htmlFor="arquivo-dialog"
                        className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-5 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                        {nomeArquivo ? (
                            <>
                                <FileText className="size-6 text-primary shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {nomeArquivo}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Clique para trocar
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Upload className="size-6 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        Selecionar PDF
                                    </p>
                                    <p className="text-xs text-muted-foreground">Máx. 10 MB</p>
                                </div>
                            </>
                        )}
                    </label>
                    <input
                        id="arquivo-dialog"
                        type="file"
                        accept=".pdf,application/pdf"
                        className="sr-only"
                        {...fileRegister}
                        ref={(el) => {
                            fileRef(el);
                            fileInputRef.current = el;
                        }}
                        onChange={(e) => {
                            fileRegister.onChange(e);
                            setNomeArquivo(e.target.files?.[0]?.name ?? null);
                        }}
                    />
                    <FieldError errors={[form.formState.errors.arquivo]} />
                </Field>

                {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Cadastrando...
                        </>
                    ) : (
                        <>
                            <Upload className="size-4" />
                            Cadastrar exame
                        </>
                    )}
                </Button>
            </FieldGroup>
        </form>
    );
};

const ExameSuccess = ({
    result,
    onNovo,
}: {
    result: Result;
    onNovo: () => void;
}) => {
    const [copiado, setCopiado] = useState(false);

    const copiar = async () => {
        await navigator.clipboard.writeText(result.link);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    return (
        <div className="space-y-5 text-center">
            <div className="flex flex-col items-center gap-2">
                <div className="size-14 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="size-7 text-green-600" />
                </div>
                <div>
                    <p className="font-semibold text-foreground">Exame cadastrado!</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {result.nomePaciente} · Protocolo {result.protocolo}
                    </p>
                </div>
            </div>

            {result.whatsappEnviado && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl px-4 py-2.5">
                    <MessageCircle className="size-4 shrink-0" />
                    Mensagem WhatsApp enviada ao paciente
                </div>
            )}

            <div className="space-y-1.5 text-left">
                <p className="text-sm font-medium">Link do paciente</p>
                <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-muted px-3 py-2.5 rounded-xl border border-border text-muted-foreground break-all font-mono">
                        {result.link}
                    </code>
                    <Button
                        type="button"
                        variant={copiado ? 'secondary' : 'outline'}
                        size="icon-sm"
                        onClick={copiar}
                        className="shrink-0"
                    >
                        <ClipboardCopy className="size-4" />
                    </Button>
                </div>
                {copiado && <p className="text-xs text-green-600 font-medium">Link copiado!</p>}
            </div>

            <Button onClick={onNovo} className="w-full">
                <PlusCircle className="size-4" />
                Cadastrar novo exame
            </Button>
        </div>
    );
};

export const NovoExameDialog = ({ children }: PropsWithChildren) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<Result | null>(null);

    const handleSuccess = (r: Result) => {
        setResult(r);
        queryClient.invalidateQueries({ queryKey: ['exames'] });
    };

    const handleNovo = () => setResult(null);

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) setTimeout(() => setResult(null), 200);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {result ? 'Exame cadastrado' : 'Novo exame'}
                    </DialogTitle>
                    {!result && (
                        <DialogDescription>
                            Preencha os dados do paciente e envie o PDF do resultado.
                        </DialogDescription>
                    )}
                </DialogHeader>

                {result ? (
                    <ExameSuccess result={result} onNovo={handleNovo} />
                ) : (
                    <ExameForm onSuccess={handleSuccess} />
                )}
            </DialogContent>
        </Dialog>
    );
};
