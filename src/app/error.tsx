'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

const ErrorPage = ({ error, reset }: Props) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <header className="p-6">Logo</header>

            <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-destructive/10">
                    <AlertTriangle className="size-10 text-destructive" />
                </div>

                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                    Algo deu errado
                </p>
                <h1 className="mb-3 text-3xl font-bold tracking-tight">Erro inesperado</h1>
                <p className="mb-8 max-w-sm text-muted-foreground">
                    Ocorreu um erro ao carregar esta página. Tente novamente ou entre em contato com
                    o suporte.
                </p>

                {error.digest && (
                    <p className="mb-6 font-mono text-xs text-muted-foreground/50">
                        ID: {error.digest}
                    </p>
                )}

                <div className="flex gap-3">
                    <Button onClick={reset}>Tentar novamente</Button>
                    <Button variant="outline" asChild>
                        <a href="/">Voltar para o início</a>
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default ErrorPage;
