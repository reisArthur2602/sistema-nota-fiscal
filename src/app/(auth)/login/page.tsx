import { ArrowLeft, CheckCircle, Download, FileText, Shield, Upload } from 'lucide-react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Logo } from '@/components/logo';
import { getSession } from '@/utils/session';

import { LoginForm } from './login-form';

export const metadata: Metadata = {
    title: 'Entrar',
    description: 'Acesse o sistema MeuExame com suas credenciais.',
};

/* ── Cards decorativos flutuantes ────────────────────────────────── */

const FloatingExamCard = () => (
    <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden w-72">
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="size-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">Resultado de exame</p>
                <p className="text-[10px] text-muted-foreground">Protocolo #2026-4892</p>
            </div>
            <span className="shrink-0 bg-green-500/15 text-green-400 border border-green-500/20 text-[10px] rounded-full px-2 py-0.5 font-medium">
                Disponível
            </span>
        </div>
        <div className="px-4 py-3 space-y-2.5">
            {[
                { label: 'Paciente', value: 'Maria da Silva' },
                { label: 'CPF', value: '•••.456.789-••' },
                { label: 'Protocolo', value: '2026-4892' },
            ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                    <p className="w-16 shrink-0 text-[10px] text-muted-foreground">{row.label}</p>
                    <p className="text-xs font-medium text-foreground">{row.value}</p>
                </div>
            ))}
        </div>
        <div className="px-4 pb-4">
            <div className="bg-primary/10 border border-primary/20 text-primary rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-1.5">
                <Download className="size-3" />
                Baixar PDF
            </div>
        </div>
    </div>
);

const FloatingActivityCard = () => (
    <div className="rounded-2xl border border-border bg-card shadow-xl p-4 w-64 space-y-3">
        <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Atividade recente
            </p>
            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        {[
            {
                icon: Download,
                color: 'text-green-400 bg-green-500/10',
                text: 'Maria baixou o resultado',
                time: 'agora',
            },
            {
                icon: Upload,
                color: 'text-primary bg-primary/10',
                text: 'Novo exame cadastrado',
                time: '3 min',
            },
            {
                icon: Shield,
                color: 'text-blue-400 bg-blue-500/10',
                text: 'Acesso validado com CPF',
                time: '8 min',
            },
            {
                icon: CheckCircle,
                color: 'text-indigo-400 bg-indigo-500/10',
                text: 'Auditoria registrada',
                time: '15 min',
            },
        ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
                <div
                    className={`size-6 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                >
                    <item.icon className="size-3" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                </div>
            </div>
        ))}
    </div>
);

/* ── Page ────────────────────────────────────────────────────────── */

const LoginPage = async () => {
    const session = await getSession();
    if (session) redirect('/upload');

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-background relative overflow-hidden px-4 py-12">
            {/* Glow radial no topo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="size-150 rounded-full bg-primary/15 blur-3xl -translate-y-1/2" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 size-80 rounded-full bg-indigo-500/10 blur-2xl -translate-y-1/3" />
            </div>

            {/* Grade decorativa */}
            <div className="absolute inset-0 pointer-events-none bg-grid-pattern" />

            {/* Card flutuante esquerdo (xl) */}
            <div
                className="hidden xl:block absolute top-1/2 pointer-events-none opacity-50 select-none"
                style={{
                    left: 'max(2rem, calc(50% - 580px))',
                    transform: 'translateY(-50%) rotate(-4deg)',
                }}
            >
                <FloatingExamCard />
            </div>

            {/* Card flutuante direito (xl) */}
            <div
                className="hidden xl:block absolute top-1/2 pointer-events-none opacity-50 select-none"
                style={{
                    right: 'max(2rem, calc(50% - 580px))',
                    transform: 'translateY(-50%) rotate(4deg)',
                }}
            >
                <FloatingActivityCard />
            </div>

            {/* Conteúdo principal */}
            <div className="relative z-10 w-full max-w-sm">
                {/* Logo + badge */}
                <div className="text-center mb-8 space-y-3 flex flex-col">
                    <Logo className="justify-center" />
                </div>

                {/* Card de login */}
                <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                    {/* Stripe de cor no topo */}
                    <div className="h-1 bg-linear-to-r from-blue-500 via-primary to-indigo-600" />

                    <div className="px-8 pt-7 pb-8">
                        <div className="mb-6">
                            <h1 className="text-xl font-bold text-foreground">
                                Bem-vindo de volta
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Entre com suas credenciais para acessar o sistema.
                            </p>
                        </div>

                        <LoginForm />
                    </div>
                </div>

                {/* Links abaixo do card */}
                <div className="flex items-center justify-between mt-6 px-1">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="size-3.5" />
                        Voltar ao site
                    </Link>
                    <p className="text-xs text-muted-foreground">© 2026 MeuExame</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
