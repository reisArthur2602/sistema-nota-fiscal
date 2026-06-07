import { type Metadata } from 'next';

import { LandingComoFunciona } from './landing-como-funciona';
import { LandingCta } from './landing-cta';
import { LandingFooter } from './landing-footer';
import { LandingHero } from './landing-hero';

export const metadata: Metadata = {
    title: 'MeuExame — Resultado de exames online',
    description:
        'Acesse online o resultado do seu exame. Use o link que você recebeu da clínica e baixe o PDF do seu laudo.',
};

const LandingPage = () => (
    <div className="min-h-dvh flex flex-col bg-background">
        <LandingHero />
        <LandingComoFunciona />

        <LandingCta />
        <LandingFooter />
    </div>
);

export default LandingPage;
