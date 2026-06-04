import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

const NotFound = () => {
    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <header className="p-6">
                <Logo />
            </header>

            <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-muted">
                    <FileQuestion className="size-10 text-muted-foreground" />
                </div>

                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                    Erro 404
                </p>
                <h1 className="mb-3 text-3xl font-bold tracking-tight">Página não encontrada</h1>
                <p className="mb-8 max-w-sm text-muted-foreground">
                    A página que você está procurando não existe ou foi movida.
                </p>

                <Button asChild>
                    <Link href="/">Voltar para o início</Link>
                </Button>
            </main>
        </div>
    );
};

export default NotFound;
