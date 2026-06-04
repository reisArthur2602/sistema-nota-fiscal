import type { Metadata } from 'next';

import { Logo } from '@/components/logo';
import { redirectIfAuthenticated } from '@/utils/redirect-if-authenticated';

import { LoginForm } from './login-form';

export const metadata: Metadata = {
    title: 'Entrar',
};

const LoginPage = async () => {
    await redirectIfAuthenticated();

    return (
        <main className="grid min-h-dvh lg:grid-cols-2">
            <div className="flex flex-col bg-background">
                <div className="p-6 lg:hidden">
                    <Logo />
                </div>

                <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16 pt-8">
                    <div className="w-full max-w-sm">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Bem-vindo de volta
                            </h1>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Entre com suas credenciais para acessar o sistema.
                            </p>
                        </div>

                        <LoginForm />

                        <p className="mt-8 text-center text-xs text-muted-foreground/50">
                            Acesso restrito a funcionários autorizados.
                        </p>
                    </div>
                </div>
            </div>

            {/* Painel esquerdo — waves + brand */}
            <div className="relative hidden overflow-hidden bg-card lg:flex lg:flex-col lg:justify-between lg:p-12">
                {/* Gradient base */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-primary/5" />

                {/* Blob top-right */}
                <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />

                {/* Wave SVG layers */}
                <svg
                    viewBox="0 0 1200 400"
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,280 C200,180 400,340 600,260 C800,180 1000,320 1200,240 L1200,400 L0,400 Z"
                        className="fill-primary/8"
                    />
                    <path
                        d="M0,320 C150,240 350,360 550,300 C750,240 950,340 1200,280 L1200,400 L0,400 Z"
                        className="fill-primary/6"
                    />
                    <path
                        d="M0,360 C200,300 400,380 600,340 C800,300 1000,370 1200,330 L1200,400 L0,400 Z"
                        className="fill-primary/10"
                    />
                </svg>

                {/* Blob bottom-left */}
                <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-primary/8 blur-3xl" />

                {/* Content */}
                <Logo iconClassName="size-7" />

                <div className="relative space-y-4">
                    <div className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                        <span className="mr-2 inline-block size-1.5 align-middle rounded-full bg-primary" />
                        Painel da equipe
                    </div>
                    <h2 className="text-4xl font-bold leading-tight tracking-tight">
                        Emita notas e gerencie
                        <br />
                        solicitações em
                        <br />
                        um só lugar.
                    </h2>
                    <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                        Controle o fluxo de notas fiscais da recepção até o envio ao paciente, com
                        rastreabilidade total.
                    </p>
                </div>
            </div>

            {/* Painel direito — formulário */}
        </main>
    );
};

export default LoginPage;
