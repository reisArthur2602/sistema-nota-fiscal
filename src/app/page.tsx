import { type Metadata } from 'next';
import {
    Activity,
    ArrowRight,
    CheckCircle,
    ChevronRight,
    Download,
    FileText,
    Link2,
    Lock,
    MessageSquare,
    Shield,
    Star,
    Upload,
    Users,
    Zap,
} from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Resultados de exames médicos online',
    description:
        'Acesse os resultados dos seus exames médicos online, sem filas e sem espera. Plataforma digital para clínicas e laboratórios distribuírem laudos com segurança.',
};

/* ─── Dados estáticos ───────────────────────────────────────────── */

const STATS = [
    { value: '50.000+', label: 'Exames entregues' },
    { value: '< 5s', label: 'Para acessar o laudo' },
    { value: '99,9%', label: 'De disponibilidade' },
    { value: '0', label: 'Laudos perdidos' },
];

const STEPS = [
    {
        step: '01',
        icon: MessageSquare,
        title: 'Receba o link',
        description:
            'A clínica ou laboratório envia o link do seu resultado por SMS, e-mail ou impresso no comprovante de atendimento.',
    },
    {
        step: '02',
        icon: Shield,
        title: 'Valide com seus dados',
        description:
            'O sistema confirma sua identidade pelo CPF e número de protocolo. Sem cadastro, sem senha, sem complicação.',
    },
    {
        step: '03',
        icon: Download,
        title: 'Baixe seu laudo',
        description:
            'Com um clique, você baixa o PDF e salva onde quiser — no celular, na nuvem ou envia por e-mail ao seu médico.',
    },
];

const CLINIC_FEATURES = [
    {
        icon: Upload,
        title: 'Upload simples',
        description: 'Envie o PDF do resultado em segundos. Preencha CPF, nome e protocolo — pronto.',
    },
    {
        icon: Link2,
        title: 'Link instantâneo',
        description: 'Assim que o upload é confirmado, o link do paciente é gerado automaticamente.',
    },
    {
        icon: Users,
        title: 'Gestão de equipe',
        description: 'Controle quem pode fazer upload com perfis de acesso e logs de auditoria completos.',
    },
    {
        icon: Activity,
        title: 'Auditoria completa',
        description: 'Saiba exatamente quem acessou cada resultado, quando e de onde.',
    },
    {
        icon: Zap,
        title: 'Zero infraestrutura',
        description: 'Sem servidores para configurar. Acesse pelo navegador de qualquer computador da clínica.',
    },
    {
        icon: Lock,
        title: 'LGPD ready',
        description: 'Dados dos pacientes protegidos conforme a Lei Geral de Proteção de Dados.',
    },
];

const SECURITY_POINTS = [
    { text: 'Acesso por CPF + protocolo único por exame' },
    { text: 'Cada exame tem link exclusivo e intransferível' },
    { text: 'Logs completos de quem baixou e quando' },
    { text: 'Inativação de acesso com um clique' },
    { text: 'Nenhum dado de paciente é indexado por buscadores' },
    { text: 'Conformidade com a LGPD e regulamentos de saúde' },
];

const TESTIMONIALS = [
    {
        name: 'Maria Souza',
        role: 'Paciente',
        text: 'Recebi o link no WhatsApp e em 10 segundos já tinha o resultado na mão. Nunca mais precisei voltar à clínica só para pegar papel.',
    },
    {
        name: 'Dr. Carlos Lima',
        role: 'Coordenador de laboratório',
        text: 'Reduziu em 80% as ligações de pacientes perguntando sobre resultados. A equipe ganhou tempo para o que realmente importa.',
    },
    {
        name: 'Ana Pereira',
        role: 'Paciente',
        text: 'Meu médico pediu o resultado na consulta. Abri o link no celular e mandei o PDF direto pelo WhatsApp. Simples assim.',
    },
];

/* ─── Componentes auxiliares ────────────────────────────────────── */

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
        href={href}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
    >
        {children}
    </a>
);

const SectionBadge = ({ children }: { children: React.ReactNode }) => (
    <Badge variant="secondary" className="mb-4 uppercase tracking-wider text-xs">
        {children}
    </Badge>
);

/* ─── Page ──────────────────────────────────────────────────────── */

const HomePage = () => (
    <div className="min-h-dvh flex flex-col bg-background">
        {/* ── NAVBAR ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Logo size="sm" />

                <nav className="hidden md:flex items-center gap-8">
                    <NavLink href="#como-funciona">Como funciona</NavLink>
                    <NavLink href="#para-clinicas">Para clínicas</NavLink>
                    <NavLink href="#seguranca">Segurança</NavLink>
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/exame"
                        className={cn(buttonVariants({ size: 'sm' }))}
                    >
                        <Download className="size-3.5" />
                        Acessar exame
                    </Link>
                </div>
            </div>
        </header>

        {/* ── HERO ───────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-background">
            {/* Glow radial superior */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 size-150 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute top-8 left-1/2 -translate-x-1/2 size-80 rounded-full bg-indigo-500/15 blur-2xl" />
            </div>

            {/* Grade decorativa */}
            <div className="absolute inset-0 pointer-events-none bg-grid-pattern" />

            {/* Conteúdo centralizado */}
            <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-12 lg:pt-28 lg:pb-16 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
                    <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-primary text-sm font-medium">Plataforma online 24h</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.05] tracking-tight mb-6">
                    Seu laudo médico,{' '}
                    <span className="bg-linear-to-r from-blue-400 via-primary to-indigo-400 bg-clip-text text-transparent">
                        online
                    </span>{' '}
                    e seguro.
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    A clínica envia o link — você acessa o resultado em segundos, de qualquer dispositivo, sem criar conta.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                    <Link
                        href="/exame"
                        className={cn(
                            buttonVariants({ size: 'lg' }),
                            'gap-2 shadow-lg shadow-primary/30 font-semibold',
                        )}
                    >
                        <Download className="size-4" />
                        Acessar meu exame
                    </Link>
                    <Link
                        href="/login"
                        className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'gap-2')}
                    >
                        Sou profissional de saúde
                        <ArrowRight className="size-4" />
                    </Link>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap items-center gap-6 justify-center text-muted-foreground text-sm">
                    {['Sem cadastro', 'Sem senha', 'Acesso imediato', '100% seguro'].map((item) => (
                        <span key={item} className="flex items-center gap-1.5">
                            <CheckCircle className="size-3.5 text-green-500" />
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Mockup em perspectiva 3D */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
                {/* Glow atrás do mockup */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-primary/15 blur-3xl rounded-full pointer-events-none" />

                <div style={{ perspective: '1400px' }}>
                    <div
                        className="relative rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden"
                        style={{ transform: 'rotateX(6deg) scale(0.98)', transformOrigin: 'top center' }}
                    >
                        {/* Barra de browser */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-muted/60 border-b border-border">
                            <div className="flex gap-1.5 shrink-0">
                                <div className="size-3 rounded-full bg-red-500/50" />
                                <div className="size-3 rounded-full bg-yellow-500/50" />
                                <div className="size-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex-1 bg-background/60 border border-border/50 rounded-md h-6 flex items-center px-3 min-w-0">
                                <Lock className="size-3 text-muted-foreground mr-1.5 shrink-0" />
                                <span className="text-muted-foreground text-xs font-mono truncate">
                                    meuexame.com.br/exame?c=12345678900&amp;p=2026-4892
                                </span>
                            </div>
                        </div>

                        {/* Conteúdo do mockup */}
                        <div className="bg-muted/20 px-6 py-8 flex flex-col lg:flex-row gap-6 items-start min-h-64">
                            {/* Card resultado */}
                            <div className="w-full lg:max-w-sm shrink-0 rounded-2xl border border-border bg-background overflow-hidden shadow-sm">
                                <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
                                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Download className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Resultado de exame</p>
                                        <p className="text-xs text-muted-foreground">Olá, Maria!</p>
                                    </div>
                                    <span className="ml-auto shrink-0 bg-green-500/15 text-green-400 border border-green-500/20 text-xs rounded-full px-2.5 py-0.5 font-medium">
                                        Disponível
                                    </span>
                                </div>
                                <div className="px-5 py-4 space-y-3">
                                    {[
                                        { label: 'Paciente', value: 'Maria da Silva' },
                                        { label: 'CPF', value: '•••.456.789-••' },
                                        { label: 'Protocolo', value: '2026-4892' },
                                        { label: 'Cadastrado em', value: '6 de junho de 2026' },
                                    ].map((row) => (
                                        <div key={row.label} className="flex items-start gap-3">
                                            <p className="w-24 shrink-0 text-xs text-muted-foreground pt-0.5">
                                                {row.label}
                                            </p>
                                            <p className="text-sm font-medium text-foreground">{row.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-5 pb-5">
                                    <div className="bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
                                        <Download className="size-4" />
                                        Baixar resultado em PDF
                                    </div>
                                </div>
                            </div>

                            {/* Painel lateral — atividade (só desktop) */}
                            <div className="hidden lg:flex flex-col flex-1 gap-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Atividade recente
                                </p>
                                {[
                                    { icon: Download, color: 'text-green-400 bg-green-500/10', text: 'Maria da Silva baixou o resultado', time: 'agora' },
                                    { icon: Upload, color: 'text-primary bg-primary/10', text: 'Dr. João enviou novo exame — Protocolo #4893', time: '2 min' },
                                    { icon: Shield, color: 'text-blue-400 bg-blue-500/10', text: 'Acesso validado via CPF + protocolo', time: '5 min' },
                                    { icon: FileText, color: 'text-indigo-400 bg-indigo-500/10', text: 'Carlos Souza acessou o resultado', time: '12 min' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-background/50">
                                        <div className={cn('size-7 rounded-lg flex items-center justify-center shrink-0', item.color)}>
                                            <item.icon className="size-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fade de saída */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-background pointer-events-none" />
            </div>
        </section>

        {/* ── STATS BAR ──────────────────────────────────────────── */}
        <section className="py-12 bg-muted/40 border-b border-border">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {STATS.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-3xl font-extrabold text-foreground mb-1">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────────── */}
        <section id="como-funciona" className="py-24 bg-background">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <SectionBadge>Para pacientes</SectionBadge>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        3 passos para acessar seu resultado
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        O processo foi pensado para ser o mais simples possível. Qualquer pessoa consegue acessar seu laudo sem ajuda.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {STEPS.map((step, i) => (
                        <div key={step.step} className="relative">
                            {/* Connector line (desktop) */}
                            {i < STEPS.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-[calc(100%-16px)] w-8 h-px bg-border z-10" />
                            )}

                            <div className="bg-card border border-border rounded-2xl p-8 h-full hover:border-primary/30 hover:shadow-md transition-all duration-200">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="relative">
                                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <step.icon className="size-6 text-primary" />
                                        </div>
                                        <span className="absolute -top-2 -right-2 size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Example link box */}
                <div className="mt-12 max-w-2xl mx-auto bg-muted/50 border border-border rounded-2xl p-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Exemplo de link que você recebe
                    </p>
                    <code className="block text-sm text-primary font-mono bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 break-all">
                        meuexame.com.br/exame?c=12345678900&amp;p=2026-4892
                    </code>
                    <p className="text-xs text-muted-foreground mt-3 flex flex-wrap gap-4">
                        <span>
                            <span className="font-semibold text-foreground">c=</span> seu CPF (sem pontos)
                        </span>
                        <span>
                            <span className="font-semibold text-foreground">p=</span> número do protocolo
                        </span>
                    </p>
                </div>
            </div>
        </section>

        {/* ── FOR CLINICS ────────────────────────────────────────── */}
        <section id="para-clinicas" className="py-24 bg-muted/30 border-y border-border">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Copy */}
                    <div>
                        <SectionBadge>Para clínicas e laboratórios</SectionBadge>
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
                            Distribua laudos digitalmente e elimine filas no guichê
                        </h2>
                        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                            Reduza o volume de chamadas e visitas de pacientes pedindo resultados. Sua equipe ganha tempo — o paciente ganha comodidade.
                        </p>

                        <ul className="space-y-3 mb-8">
                            {[
                                'Cadastro de exame em menos de 30 segundos',
                                'Link gerado automaticamente para o paciente',
                                'Auditoria completa de acessos',
                                'Controle de equipe com perfis de permissão',
                                'Inativação de acesso a qualquer momento',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <CheckCircle className="size-4 text-primary mt-0.5 shrink-0" />
                                    <span className="text-sm text-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/login"
                            className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}
                        >
                            Acessar o sistema
                            <ChevronRight className="size-4" />
                        </Link>
                    </div>

                    {/* Feature grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {CLINIC_FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                                    <feature.icon className="size-4 text-primary" />
                                </div>
                                <h3 className="font-semibold text-sm text-foreground mb-1">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* ── SECURITY ───────────────────────────────────────────── */}
        <section id="seguranca" className="py-24 bg-background">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Visual */}
                    <div className="order-2 lg:order-1">
                        <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-border">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Shield className="size-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">Central de segurança</p>
                                    <p className="text-xs text-muted-foreground">Protocolos ativos</p>
                                </div>
                                <span className="ml-auto size-2.5 rounded-full bg-green-500 animate-pulse" />
                            </div>
                            {SECURITY_POINTS.map((point) => (
                                <div key={point.text} className="flex items-start gap-3">
                                    <CheckCircle className="size-4 text-green-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-foreground">{point.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Copy */}
                    <div className="order-1 lg:order-2">
                        <SectionBadge>Segurança &amp; privacidade</SectionBadge>
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
                            Dados médicos merecem proteção máxima
                        </h2>
                        <p className="text-muted-foreground text-lg mb-5 leading-relaxed">
                            Cada exame possui um link exclusivo protegido por CPF e protocolo. Sem conta, sem senha compartilhada — apenas você acessa o seu resultado.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Todas as operações são registradas em log de auditoria. A clínica pode inativar o acesso a qualquer momento, e os dados nunca são indexados por buscadores.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────────── */}
        <section className="py-24 bg-muted/30 border-y border-border">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-14">
                    <SectionBadge>Depoimentos</SectionBadge>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                        O que dizem quem usa
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                        <div
                            key={t.name}
                            className="bg-card border border-border rounded-2xl p-7 flex flex-col hover:shadow-md hover:border-border/80 transition-all duration-200"
                        >
                            <div className="flex gap-0.5 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-foreground text-sm leading-relaxed flex-1 mb-6">
                                &ldquo;{t.text}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-border">
                                <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                                    <span className="text-primary font-bold text-sm">{t.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── FINAL CTA ──────────────────────────────────────────── */}
        <section className="py-24 bg-linear-to-br from-primary via-primary/90 to-indigo-900 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 size-80 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 size-60 rounded-full bg-indigo-400/10 blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                    Pronto para acessar<br className="hidden sm:block" /> seu resultado?
                </h2>
                <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
                    Use o link que você recebeu da clínica — sem cadastro, sem senha.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/exame"
                        className={cn(
                            buttonVariants({ size: 'lg' }),
                            'bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/20 gap-2',
                        )}
                    >
                        <Download className="size-4" />
                        Acessar meu exame
                    </Link>
                    <Link
                        href="/login"
                        className={cn(
                            buttonVariants({ size: 'lg', variant: 'outline' }),
                            'border-white/30 text-white hover:bg-white/10 hover:text-white gap-2',
                        )}
                    >
                        Sou profissional de saúde
                        <ChevronRight className="size-4" />
                    </Link>
                </div>
            </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer className="bg-card border-t border-border py-14">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-10 mb-10">
                    <div className="md:col-span-2">
                        <Logo className="mb-4" />
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            Plataforma digital para distribuição segura de resultados de exames médicos. Rápido, simples e seguro.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-foreground text-sm mb-4 uppercase tracking-wider">Plataforma</p>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a></li>
                            <li><a href="#para-clinicas" className="hover:text-foreground transition-colors">Para clínicas</a></li>
                            <li><a href="#seguranca" className="hover:text-foreground transition-colors">Segurança</a></li>
                            <li>
                                <Link href="/login" className="hover:text-foreground transition-colors">
                                    Acessar sistema
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="font-semibold text-foreground text-sm mb-4 uppercase tracking-wider">Contato</p>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>contato@meuexame.com.br</li>
                            <li>Suporte 24 horas</li>
                            <li className="flex items-center gap-2">
                                <Lock className="size-3.5 text-primary" />
                                <span>Dados protegidos</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="mb-8" />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2026 MeuExame. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-foreground transition-colors">Termos de uso</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
);

export default HomePage;
