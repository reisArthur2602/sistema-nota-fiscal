import {
    CheckCircle2,
    ClipboardList,
    FileCheck,
    FileText,
    ScrollText,
    Search,
    Send,
    Shield,
    Users,
    Zap,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'NotaFácil — Nota fiscal integrada do registro ao envio',
    openGraph: {
        title: 'NotaFácil — Nota fiscal integrada',
        description:
            'Automatize todo o processo de nota fiscal — da solicitação ao envio ao paciente.',
        url: '/',
    },
    robots: {
        index: true,
        follow: false,
        googleBot: { index: true, follow: false },
    },
};

const features = [
    {
        icon: Search,
        title: 'Busca automática',
        description:
            'Informe o ID do registro e os dados do paciente são preenchidos automaticamente. Zero digitação manual, zero erro humano.',
    },
    {
        icon: FileCheck,
        title: 'Fila de emissão',
        description:
            'O emissor visualiza todas as solicitações em fila, processa e envia o link da nota fiscal por e-mail com um clique.',
    },
    {
        icon: ScrollText,
        title: 'Auditoria completa',
        description:
            'Cada ação é registrada com data, hora e responsável. Tenha controle total sobre o que acontece no sistema.',
    },
];

const steps = [
    {
        icon: ClipboardList,
        title: 'Recepção solicita',
        description:
            'A recepção busca o registro do paciente pelo ID, confirma os dados e envia a solicitação para a fila de emissão.',
    },
    {
        icon: FileText,
        title: 'Emissor processa',
        description:
            'O emissor visualiza as solicitações pendentes, emite a nota no sistema externo e insere o link para envio.',
    },
    {
        icon: Send,
        title: 'Paciente recebe',
        description:
            'O sistema envia automaticamente o e-mail ao paciente com o link da nota fiscal e atualiza o status.',
    },
];

const extras = [
    { icon: Shield, text: 'Controle de acesso por perfil' },
    { icon: Zap, text: 'Notificações em tempo real' },
    { icon: Users, text: 'Múltiplos usuários simultâneos' },
    { icon: CheckCircle2, text: 'Status atualizado automaticamente' },
];

const LandingPage = () => {
    return (
        <div className="flex-1 bg-background">
            {/* Nav */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Logo />
                    <Button asChild size="sm">
                        <Link href="/login">Acessar o sistema</Link>
                    </Button>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden border-b">
                {/* Grid pattern */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]" />

                {/* Gradient blobs */}
                <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/15 blur-[100px] animate-pulse" />
                <div className="pointer-events-none absolute -bottom-16 -right-32 size-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse [animation-delay:1.5s]" />
                <div className="pointer-events-none absolute left-1/2 top-0 size-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[160px]" />

                <div className="relative mx-auto max-w-6xl px-6 py-28 text-center md:py-40">
                    <Badge
                        variant="outline"
                        className="mb-7 animate-fade-down border-primary/30 bg-primary/5 text-sm text-primary"
                    >
                        <span className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-primary" />
                        Ferramenta interna
                    </Badge>

                    <h1 className="animate-fade-up text-5xl font-bold tracking-tight text-foreground md:text-7xl [animation-delay:100ms]">
                        Nota fiscal integrada
                        <br />
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                            do registro ao envio.
                        </span>
                    </h1>

                    <p className="mx-auto mt-7 max-w-xl animate-fade-up text-lg text-muted-foreground [animation-delay:200ms]">
                        Automatize todo o processo — da solicitação à entrega ao paciente — sem
                        planilhas, sem retrabalho e com rastreabilidade completa.
                    </p>

                    <div className="mt-10 animate-fade-up [animation-delay:300ms]">
                        <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                            <Link href="/login">Acessar o sistema</Link>
                        </Button>
                    </div>

                    <div className="mt-16 flex animate-fade-up flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground [animation-delay:400ms]">
                        {[
                            '3 perfis de acesso',
                            'Envio automático por e-mail',
                            'Histórico auditável',
                        ].map((item) => (
                            <span key={item} className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-primary" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-6xl px-6 py-28">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Tudo o que sua equipe precisa
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Projetado para o fluxo real de emissão de nota fiscal da sua empresa.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="group rounded-2xl border bg-card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                                <Icon className="size-6 text-primary" />
                            </div>
                            <h3 className="mb-2 font-semibold">{title}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="relative overflow-hidden border-y bg-muted/30">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(var(--primary)/0.04),transparent)]" />

                <div className="relative mx-auto max-w-6xl px-6 py-28">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Como funciona
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Três etapas simples, do início ao fim.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                        {steps.map(({ icon: Icon, title, description }, i) => (
                            <div
                                key={title}
                                className="relative flex flex-col items-center text-center"
                            >
                                {i < steps.length - 1 && (
                                    <div className="absolute left-1/2 top-7 hidden h-px w-full translate-x-8 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent md:block" />
                                )}

                                <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 transition-all duration-300 hover:scale-110 hover:from-primary/30 hover:to-primary/10">
                                    <Icon className="size-6 text-primary" />
                                    <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm">
                                        {i + 1}
                                    </span>
                                </div>

                                <h3 className="mb-2 font-semibold">{title}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Extras + Roles */}
            <section className="mx-auto max-w-6xl px-6 py-28">
                <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Controle e visibilidade{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                em tempo real
                            </span>
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Cada perfil tem acesso exatamente ao que precisa. Agilidade sem abrir
                            mão do controle.
                        </p>

                        <ul className="mt-8 space-y-3">
                            {extras.map(({ icon: Icon, text }) => (
                                <li key={text} className="group flex items-center gap-3 text-sm">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-200 group-hover:bg-primary/20">
                                        <Icon className="size-4 text-primary" />
                                    </div>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border bg-card p-8 shadow-sm">
                        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                            Perfis de acesso
                        </p>
                        <div className="space-y-3">
                            {[
                                {
                                    role: 'Recepção',
                                    desc: 'Cria e acompanha solicitações de nota fiscal.',
                                    className: 'bg-muted/60 text-muted-foreground',
                                },
                                {
                                    role: 'Emissor',
                                    desc: 'Processa a fila e envia as notas aos pacientes.',
                                    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                                },
                                {
                                    role: 'Super Admin',
                                    desc: 'Gerencia a equipe e acessa o histórico de auditoria.',
                                    className: 'bg-primary/10 text-primary',
                                },
                            ].map(({ role, desc, className }) => (
                                <div
                                    key={role}
                                    className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4 transition-colors duration-200 hover:bg-muted/40"
                                >
                                    <span
                                        className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
                                    >
                                        {role}
                                    </span>
                                    <p className="text-sm text-muted-foreground">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden border-t">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,hsl(var(--primary)/0.08),transparent)]" />
                <div className="pointer-events-none absolute left-1/2 top-0 size-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

                <div className="relative mx-auto max-w-6xl px-6 py-28 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Pronto para começar?
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Acesse o sistema com as credenciais fornecidas pelo administrador.
                    </p>
                    <Button asChild size="lg" className="mt-10 shadow-lg shadow-primary/20">
                        <Link href="/login">Entrar na plataforma</Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <Logo iconClassName="size-5" textClassName="text-xs" />
                    <p className="text-xs text-muted-foreground">
                        Uso interno — todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
