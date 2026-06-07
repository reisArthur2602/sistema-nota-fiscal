import { Download, Link2, MessageSquare } from 'lucide-react';

const STEPS = [
    {
        icon: MessageSquare,
        title: 'Receba o link',
        description:
            'A clínica envia o link do seu resultado por WhatsApp, SMS ou e-mail assim que o laudo estiver disponível.',
    },
    {
        icon: Link2,
        title: 'Clique e confirme',
        description:
            'O sistema valida o seu CPF e número de protocolo. Sem criar conta, sem senha para lembrar.',
    },
    {
        icon: Download,
        title: 'Baixe o seu laudo',
        description:
            'Faça o download do PDF e guarde onde preferir — no celular, no computador ou envie ao seu médico.',
    },
];

export const LandingComoFunciona = () => (
    <section id="como-funciona" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-14">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                    Como acessar o seu resultado
                </h2>
                <p className="mt-3 text-muted-foreground text-lg">
                    Três passos simples — funciona em qualquer celular ou computador.
                </p>
            </div>

            <div className="space-y-4">
                {STEPS.map((step, i) => (
                    <div
                        key={step.title}
                        className="flex items-start gap-5 rounded-3xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                    >
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <step.icon className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                Passo {i + 1}
                            </span>
                            <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
