import { type Metadata } from 'next';
import { AlertCircle, Calendar, Download, Hash, User } from 'lucide-react';

import { Logo } from '@/components/logo';
import { buttonVariants } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { formatCPF } from '@/utils/format-cpf';

export const metadata: Metadata = {
    title: 'Resultado de exame',
    description: 'Acesse o resultado do seu exame médico de forma segura.',
};

const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo',
    });

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground mt-0.5 wrap-break-word">{value}</p>
        </div>
    </div>
);

type Props = {
    searchParams: Promise<{ c?: string; p?: string }>;
};

const ExamePage = async ({ searchParams }: Props) => {
    const { c: cpf, p: protocolo } = await searchParams;

    if (!cpf || !protocolo) {
        return (
            <PageShell>
                <ErrorCard
                    title="Link inválido"
                    description="O link que você acessou está incompleto ou incorreto. Verifique o link recebido e tente novamente."
                />
            </PageShell>
        );
    }

    const rawCpf = cpf.replace(/\D/g, '');

    const exame = await prisma.exame.findFirst({
        where: { cpf: rawCpf, protocolo, ativo: true },
        select: { nomePaciente: true, cpf: true, protocolo: true, criadoEm: true },
    });

    if (!exame) {
        return (
            <PageShell>
                <ErrorCard
                    title="Exame não encontrado"
                    description="Não encontramos nenhum resultado com os dados informados. O exame pode estar inativo ou o link pode estar incorreto. Entre em contato com a clínica."
                />
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Download className="size-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-foreground">Resultado de exame</h1>
                            <p className="text-sm text-muted-foreground">
                                Olá, {exame.nomePaciente.split(' ')[0]}!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <InfoRow
                        icon={<User className="size-4 text-muted-foreground" />}
                        label="Paciente"
                        value={exame.nomePaciente}
                    />
                    <InfoRow
                        icon={<Hash className="size-4 text-muted-foreground" />}
                        label="CPF"
                        value={formatCPF(exame.cpf)}
                    />
                    <InfoRow
                        icon={<Hash className="size-4 text-muted-foreground" />}
                        label="Protocolo"
                        value={exame.protocolo}
                    />
                    <InfoRow
                        icon={<Calendar className="size-4 text-muted-foreground" />}
                        label="Cadastrado em"
                        value={formatDate(exame.criadoEm)}
                    />
                </div>

                <div className="px-6 pb-6">
                    <a
                        href={`/api/exame/pdf?c=${rawCpf}&p=${exame.protocolo}`}
                        className={cn(buttonVariants({ size: 'lg' }), 'w-full gap-2')}
                    >
                        <Download className="size-4" />
                        Baixar resultado em PDF
                    </a>
                </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
                Problema com o acesso? Entre em contato com a clínica.
            </p>
        </PageShell>
    );
};

const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-dvh bg-muted/30 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <Logo className="justify-center" />
                <p className="text-sm text-muted-foreground mt-2">
                    Acesse o resultado do seu exame
                </p>
            </div>
            {children}
        </div>
    </div>
);

const ErrorCard = ({ title, description }: { title: string; description: string }) => (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-8 text-center">
        <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="size-7 text-destructive" />
        </div>
        <h2 className="font-semibold text-lg text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
    </div>
);

export default ExamePage;
