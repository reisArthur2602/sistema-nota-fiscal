import {
    ArrowRight,
    CheckCircle,
    Download,
    FileText,
    MessageSquare,
    ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import { LandingHeader } from './landing-header';

const Connector = ({ step, label }: { step: number; label: string }) => (
    <div className="flex items-stretch gap-3 pl-[1.6rem] h-12">
        {/* Trilho vertical + círculo numerado */}
        <div className="flex flex-col items-center">
            <span className="w-px flex-1 bg-gradient-to-b from-white/5 to-white/20" />
            <span className="my-1 size-6 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm flex items-center justify-center shrink-0 text-[10px] font-bold text-white/70 shadow-sm">
                {step}
            </span>
            <span className="w-px flex-1 bg-gradient-to-b from-white/20 to-white/5" />
        </div>
        <span className="self-center text-[11px] text-white/40 tracking-wide">{label}</span>
    </div>
);

const HeroVisual = () => (
    <div className="relative w-[340px] pointer-events-none select-none">
        {/* ── Card 1: Notificação WhatsApp ── */}
        <div className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-sm p-5 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <div className="relative shrink-0">
                <div className="size-11 rounded-2xl bg-[#25d366] flex items-center justify-center shadow-md shadow-[#25d366]/40">
                    <MessageSquare className="size-5 text-white" />
                </div>
                {/* Pingo de notificação */}
                <span className="absolute -top-1 -right-1 flex size-3">
                    <span className="absolute inline-flex size-full rounded-full bg-sky-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex size-3 rounded-full bg-sky-400 ring-2 ring-[#101a3d]" />
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                            WhatsApp
                        </p>
                        <p className="text-sm font-semibold text-white leading-none">
                            Clínica MeuExame
                        </p>
                    </div>
                    <p className="text-[10px] text-white/35 shrink-0 mt-0.5">agora</p>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mt-1.5">
                    Olá, Maria! Seu resultado já está disponível. Acesse pelo link 🔗
                </p>
            </div>
        </div>

        {/* Passo 1 */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both [animation-delay:200ms]">
            <Connector step={1} label="Abre o link recebido" />
        </div>

        {/* ── Card 2: Resultado do exame ── */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1225] p-5 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both [animation-delay:350ms]">
            <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0">
                    <FileText className="size-5 text-sky-300" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Resultado de exame</p>
                    <p className="text-[11px] text-white/40 mt-0.5">Protocolo #2026-4892</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-[10px] px-2.5 py-1 font-semibold shrink-0">
                    <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
                    Disponível
                </span>
            </div>

            <div className="space-y-2.5 pb-4 mb-4 border-b border-white/8">
                {[
                    { label: 'Paciente', value: 'Maria da Silva' },
                    { label: 'Protocolo', value: '#2026-4892' },
                    { label: 'Emitido em', value: '06 de jun. de 2026' },
                ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                        <p className="w-20 text-[11px] text-white/35 shrink-0">{row.label}</p>
                        <p className="text-xs font-medium text-white/75">{row.value}</p>
                    </div>
                ))}
            </div>

            <div className="relative flex items-center gap-2.5 bg-sky-500/12 border border-sky-500/20 rounded-xl px-4 py-3 overflow-hidden">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.4s_ease-in-out_infinite]" />
                <Download className="size-4 text-sky-300 shrink-0" />
                <span className="text-sm font-semibold text-sky-300">Baixar resultado em PDF</span>
            </div>
        </div>

        {/* Passo 2 */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both [animation-delay:500ms]">
            <Connector step={2} label="Baixa o PDF do laudo" />
        </div>

        {/* ── Card 3: Sucesso ── */}
        <div className="relative flex items-center gap-4 rounded-2xl border border-green-500/25 bg-green-500/8 p-5 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both [animation-delay:650ms]">
            <span className="absolute inset-0 rounded-2xl ring-1 ring-green-400/20 animate-pulse pointer-events-none" />
            <div className="size-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                <CheckCircle className="size-5 text-green-400" />
            </div>
            <div>
                <p className="text-sm font-semibold text-white">PDF baixado com sucesso</p>
                <p className="text-[11px] text-white/45 mt-0.5">Resultado salvo no dispositivo</p>
            </div>
        </div>
    </div>
);

export const LandingHero = () => (
    <div className="bg-[#101a3d] text-white relative overflow-hidden">
        {/* Glows de fundo */}
        <div className="absolute -top-32 -left-20 size-150 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 size-96 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />

        <LandingHeader />

        <section className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-16 pb-24 lg:pt-20 lg:pb-48">
            <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
                {/* ── Texto ── */}
                <div className="max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 mb-8">
                        <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                        Resultados disponíveis online, 24 horas
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                        Seu resultado,
                        <br />
                        <span className="inline-block rounded-2xl bg-sky-300 px-4 pb-1.5 text-[#101a3d] mt-2">
                            disponível
                        </span>
                        <br />
                        agora.
                    </h1>

                    <p className="mt-7 text-lg lg:text-xl text-white/65 max-w-lg leading-relaxed">
                        Recebeu um link da clínica? Clique para acessar e baixar o PDF do seu exame
                        — sem criar conta, sem senha.
                    </p>

                    {/* CTAs */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/exame"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-300 text-[#101a3d] hover:bg-sky-200 font-semibold px-7 py-3.5 text-base transition-colors"
                        >
                            <Download className="size-5" />
                            Acessar meu exame
                        </Link>
                        <a
                            href="#como-funciona"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium px-7 py-3.5 text-base transition-colors"
                        >
                            Como funciona
                            <ArrowRight className="size-4" />
                        </a>
                    </div>

                    {/* Trust pills */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        {[
                            { icon: ShieldCheck, text: 'Sem cadastro' },
                            { icon: ShieldCheck, text: 'Sem senha' },
                            { icon: ShieldCheck, text: 'Qualquer dispositivo' },
                        ].map((item) => (
                            <span
                                key={item.text}
                                className="inline-flex items-center gap-1.5 text-sm text-white/55"
                            >
                                <CheckCircle className="size-3.5 text-sky-300/70 shrink-0" />
                                {item.text}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Visual ── */}
                <div className="hidden lg:flex items-center justify-end shrink-0">
                    <HeroVisual />
                </div>
            </div>
        </section>
    </div>
);
