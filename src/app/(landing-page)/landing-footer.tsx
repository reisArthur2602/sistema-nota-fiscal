import { Lock } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';

export const LandingFooter = () => (
    <footer className="border-t border-border bg-muted/30 py-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground text-center">
                Dúvidas? Entre em contato com a clínica que realizou o seu exame.
            </p>
            <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0"
            >
                <Lock className="size-3.5" />
                Acesso restrito
            </Link>
        </div>
    </footer>
);
