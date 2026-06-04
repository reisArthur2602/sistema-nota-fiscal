'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { type PropsWithChildren, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { buildMensagem } from '@/utils/build-message';

import { enviarNota } from './actions';
import type { SolicitacaoRow } from './emissor-columns';

const schema = z.object({
    linkNota: z.url({ message: 'Informe uma URL válida.' }),
});

type FormData = z.infer<typeof schema>;

type Props = PropsWithChildren<{
    solicitacao: SolicitacaoRow;
}>;

export const EnviarNotaDialog = ({ solicitacao, children }: Props) => {
    const [open, setOpen] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { linkNota: '' },
    });

    const linkNota = form.watch('linkNota');

    const mutation = useMutation({
        mutationFn: (data: FormData) => enviarNota(solicitacao.id, data.linkNota),
        onSuccess: () => {
            form.reset();
            setOpen(false);
        },
    });

    const handleOpenChange = (v: boolean) => {
        if (!v) form.reset();
        setOpen(v);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
                    <DialogHeader>
                        <DialogTitle>Enviar Nota Fiscal</DialogTitle>
                        <DialogDescription>
                            {solicitacao.nome} — {solicitacao.especialidade}
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
                                    {buildMensagem(solicitacao, linkNota)}
                                </pre>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending && <Spinner />}
                            {mutation.isPending ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
