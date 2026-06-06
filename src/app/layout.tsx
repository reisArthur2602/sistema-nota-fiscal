import type { Metadata } from 'next';
import { Geist_Mono, Manrope } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { ReactQuery } from '@/integrations/react-query';
import { cn } from '@/lib/utils';

import './globals.css';

const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
    weight: ['400', '500', '600', '700', '800'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'),
    title: {
        template: '%s — MeuExame',
        default: 'MeuExame — Resultados de exames médicos online',
    },
    description:
        'Acesse os resultados dos seus exames médicos online com segurança e rapidez. Sem filas, sem espera — só com o link que você recebeu.',
    keywords: [
        'exame médico',
        'resultado de exame',
        'laudo médico',
        'resultado online',
        'exame online',
        'laudo digital',
    ],
    authors: [{ name: 'MeuExame' }],
    creator: 'MeuExame',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        url: '/',
        title: 'MeuExame — Resultados de exames médicos online',
        siteName: 'MeuExame',
        description: 'Acesse os resultados dos seus exames médicos online com segurança e rapidez.',
        locale: 'pt_BR',
        type: 'website',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-BR"
            className={cn('antialiased', manrope.variable, geistMono.variable, 'font-sans')}
        >
            <ReactQuery>
                <body className="dark">
                    <Toaster />
                    {children}
                </body>
            </ReactQuery>
        </html>
    );
}
