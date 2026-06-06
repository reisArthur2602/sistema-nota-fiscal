'use client';

import { useEffect, useRef, useState } from 'react';
import { ClipboardList, FileText, Link2, ScrollText, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dismissOnboarding } from '@/utils/dismiss-onboarding';

type Tip = {
    icon: React.ReactNode;
    title: string;
    desc: string;
};

const TIPS: Record<string, Tip[]> = {
    LAUDO: [
        {
            icon: <FileText className="size-4 text-primary" />,
            title: 'Cadastre resultados',
            desc: 'Clique em "Novo exame", preencha os dados do paciente e envie o PDF.',
        },
        {
            icon: <Link2 className="size-4 text-primary" />,
            title: 'Link gerado na hora',
            desc: 'Após o cadastro, um link único é criado para o paciente acessar o resultado com segurança.',
        },
    ],
    SUPER_ADMIN: [
        {
            icon: <ClipboardList className="size-4 text-primary" />,
            title: 'Gerencie exames',
            desc: 'Visualize, busque e controle o acesso de todos os resultados cadastrados.',
        },
        {
            icon: <Users className="size-4 text-primary" />,
            title: 'Controle a equipe',
            desc: 'Crie usuários com perfil LAUDO ou Super Admin e gerencie os acessos.',
        },
        {
            icon: <ScrollText className="size-4 text-primary" />,
            title: 'Auditoria completa',
            desc: 'Cada ação no sistema é registrada. Acompanhe o histórico em tempo real.',
        },
    ],
};

type Props = {
    show: boolean;
    nome: string;
    role: string;
};

export const OnboardingDialog = ({ show, nome, role }: Props) => {
    const [open, setOpen] = useState(false);
    const dismissed = useRef(false);

    useEffect(() => {
        if (show) setOpen(true);
    }, [show]);

    const handleClose = (v: boolean) => {
        setOpen(v);
        if (!v && !dismissed.current) {
            dismissed.current = true;
            void dismissOnboarding();
        }
    };

    const firstName = nome.split(' ')[0];
    const tips = TIPS[role] ?? TIPS.LAUDO;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent showCloseButton={false} className="sm:max-w-md gap-0">
                <DialogHeader className="items-center text-center">
                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                        <FileText className="size-7 text-primary" />
                    </div>
                    <DialogTitle className="text-xl">
                        Bem-vindo, {firstName}!
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                        Veja o que você pode fazer por aqui antes de começar.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2.5 mt-5">
                    {tips.map((tip, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3"
                        >
                            <div className="size-7 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                                {tip.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground leading-tight">
                                    {tip.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    {tip.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Button className="w-full mt-5" onClick={() => handleClose(false)}>
                    Entendi, vamos começar!
                </Button>
            </DialogContent>
        </Dialog>
    );
};
