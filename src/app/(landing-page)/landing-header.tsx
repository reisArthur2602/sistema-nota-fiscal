import { Lock } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';

export const LandingHeader = () => (
    <header className="relative z-10 max-w-6xl mx-auto w-full px-6 h-16 flex items-center justify-between">
        <Logo variant="light" size="sm" />
        <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-1.5 transition-colors"
        >
            Acesso restrito
            <Lock className="size-3.5" />
        </Link>
    </header>
);
