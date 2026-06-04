'use client';

import {
    ClipboardList,
    FileCheck,
    FileText,
    Mail,
    ScrollText,
    Search,
    Send,
    Sparkles,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Role } from '@/generated/prisma/enums';
import { cn } from '@/lib/utils';

type Step = {
    icon: React.ElementType;
    title: string;
    description: string;
};

const stepsByRole: Record<Role, Step[]> = {
    RECEPCAO: [
        {
            icon: Sparkles,
            title: 'Bem-vindo ao NotaFácil',
            description:
                'Esta plataforma permite criar e acompanhar solicitações de nota fiscal de forma simples e rápida. Veja a seguir como tudo funciona.',
        },
        {
            icon: Search,
            title: 'Buscar o Registro',
            description:
                'Na página de Solicitações, informe o ID do registro no campo de busca e clique em Buscar. Os dados do paciente são preenchidos automaticamente a partir do sistema externo.',
        },
        {
            icon: ClipboardList,
            title: 'Confirmar e Enviar',
            description:
                'Revise os dados carregados, informe o valor da nota e adicione e-mail ou telefone se necessário. Clique em Enviar Solicitação para encaminhar à fila de emissão.',
        },
        {
            icon: FileText,
            title: 'Acompanhar o Status',
            description:
                'Suas últimas solicitações aparecem na tabela ao lado com o status atualizado: Pendente, Emitida ou Enviada ao paciente.',
        },
    ],
    EMISSOR: [
        {
            icon: Sparkles,
            title: 'Bem-vindo ao NotaFácil',
            description:
                'Você é responsável por processar as solicitações de nota fiscal e enviar os links para os pacientes. Veja como funciona o fluxo.',
        },
        {
            icon: FileCheck,
            title: 'Fila de Emissão',
            description:
                'Na página de Emissão você verá todas as solicitações. Use os filtros de status para focar nas pendentes. Novas solicitações geram uma notificação em tempo real.',
        },
        {
            icon: ScrollText,
            title: 'Ver Detalhes',
            description:
                'Clique no menu (⋯) de qualquer linha para abrir os dados completos do paciente, incluindo endereço, CPF, e-mail e telefone.',
        },
        {
            icon: Send,
            title: 'Enviar a Nota',
            description:
                'Após emitir a nota no sistema externo, informe o link no campo indicado. O NotaFácil envia o e-mail ao paciente automaticamente e atualiza o status da solicitação.',
        },
    ],
    SUPER_ADMIN: [
        {
            icon: Sparkles,
            title: 'Bem-vindo ao NotaFácil',
            description:
                'Você tem acesso completo à plataforma. Gerencie a equipe, acompanhe todas as solicitações e monitore o histórico de ações do sistema.',
        },
        {
            icon: Users,
            title: 'Gestão de Equipe',
            description:
                'Na página Equipe, crie, edite, ative e desative usuários. Atribua o perfil correto: Recepção (cria solicitações), Emissor (envia notas) ou Super Admin.',
        },
        {
            icon: Mail,
            title: 'Fluxo de Solicitações',
            description:
                'A Recepção cria solicitações que entram na fila do Emissor. O Emissor processa e envia o link da nota ao paciente por e-mail, atualizando o status automaticamente.',
        },
        {
            icon: ScrollText,
            title: 'Auditoria',
            description:
                'Todas as ações do sistema são registradas com data, hora e usuário responsável. Acesse a página de Auditoria e filtre por usuário, tipo de ação ou período.',
        },
    ],
};

type Props = {
    userId: string;
    role: Role;
    nome: string;
};

export const OnboardingDialog = ({ userId, role, nome }: Props) => {
    const [aberto, setAberto] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const chave = `nf_onboarding_${userId}`;
        if (!localStorage.getItem(chave)) setAberto(true);
    }, [userId]);

    const steps = stepsByRole[role];
    const { icon: Icon, title, description } = steps[step];
    const ultimo = step === steps.length - 1;

    const concluir = () => {
        localStorage.setItem(`nf_onboarding_${userId}`, '1');
        setAberto(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) concluir();
    };

    return (
        <Dialog open={aberto} onOpenChange={handleOpenChange}>
            <DialogContent
                className="gap-0 overflow-hidden p-0 sm:max-w-md"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogTitle className="sr-only">{title}</DialogTitle>
                <DialogDescription className="sr-only">{description}</DialogDescription>

                <div className="bg-muted/40 px-8 pb-8 pt-10 text-center">
                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="size-7 text-primary" />
                    </div>

                    <h2 className="text-lg font-semibold tracking-tight">
                        {step === 0 ? `Olá, ${nome.split(' ')[0]}!` : title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex gap-1.5">
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setStep(i)}
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    i === step
                                        ? 'w-6 bg-primary'
                                        : i < step
                                          ? 'w-1.5 bg-primary/40'
                                          : 'w-1.5 bg-muted-foreground/20',
                                )}
                            />
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {step > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setStep((s) => s - 1)}
                            >
                                Voltar
                            </Button>
                        )}
                        {ultimo ? (
                            <Button size="sm" onClick={concluir}>
                                Começar
                            </Button>
                        ) : (
                            <Button size="sm" onClick={() => setStep((s) => s + 1)}>
                                Próximo
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
