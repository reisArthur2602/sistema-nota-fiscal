import type { Metadata } from 'next';

import { Logo } from '@/components/logo';

import { LoginForm } from './login-form';

export const metadata: Metadata = {
    title: 'Entrar',
};

const LoginPage = () => {
    return (
        <main className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
            {/* Painel esquerdo */}
            <div className="flex flex-col bg-card">
                <div className="p-8">
                    <Logo />
                </div>

                <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16">
                    <div className="w-full max-w-sm">
                        <LoginForm />

                        <p className="mt-8 text-center text-xs text-muted-foreground/50">
                            Acesso restrito a funcionarios autorizados
                        </p>
                    </div>
                </div>
            </div>

            {/* Painel direito */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-muted/40 p-12 lg:flex">
                <div className="w-fit rounded-full border bg-background/60 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-green-500 align-middle" />
                    Painel da equipe
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-bold leading-tight tracking-tight">
                        Emita notas e gerencie
                        <br />
                        solicitacoes em
                        <br />
                        um so lugar.
                    </h2>
                    <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                        Controle o fluxo de notas fiscais da recepcao ate o envio ao paciente, com
                        rastreabilidade total.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
