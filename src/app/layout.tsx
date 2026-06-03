import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist_Mono, Manrope } from 'next/font/google';
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
    title: {
        template: '%s — NotaFácil',
        default: 'NotaFácil',
    },
    description:
        'Sistema interno de emissão e gerenciamento de notas fiscais para clínicas. Controle solicitações, emita notas e envie ao paciente em um só lugar.',
    keywords: ['nota fiscal', 'emissão de notas', 'NF-e'],
    authors: [{ name: 'NotaFácil' }],
    creator: 'NotaFácil',
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
            <body className="dark">
                {children}
                <Toaster />
            </body>
        </html>
    );
}
