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
    weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'),
    title: {
        template: '%s — NotaFácil',
        default: 'NotaFácil — Nota fiscal integrada do registro ao envio',
    },
    description:
        'Sistema de emissão e gerenciamento de notas fiscais. Controle solicitações, emita notas e envie ao paciente em um só lugar.',
    keywords: ['nota fiscal', 'emissão de notas', 'NF-e', 'gestão de notas fiscais', 'notafacil'],
    authors: [{ name: 'NotaFácil' }],
    creator: 'NotaFácil',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        url: '/',
        title: 'NotaFácil — Nota fiscal integrada do registro ao envio',
        siteName: 'NotaFácil',
        description:
            'Sistema de emissão e gerenciamento de notas fiscais. Controle solicitações, emita notas e envie ao paciente em um só lugar.',
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
