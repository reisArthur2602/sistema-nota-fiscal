'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

const FILTROS = [
    { label: 'Todas', value: undefined },
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Emitida', value: 'EMITIDA' },
    { label: 'Enviada', value: 'ENVIADA_AO_PACIENTE' },
] as const;

export const StatusFilter = ({ statusAtual }: { statusAtual?: string }) => {
    const router = useRouter();

    const handleClick = (value?: string) => {
        router.replace(value ? `?status=${value}` : '?');
    };

    return (
        <div className="flex flex-wrap gap-1.5">
            {FILTROS.map(({ label, value }) => (
                <Button
                    key={label}
                    size="sm"
                    variant={statusAtual === value ? 'default' : 'outline'}
                    onClick={() => handleClick(value)}
                    className="h-7 rounded-full px-3 text-xs"
                >
                    {label}
                </Button>
            ))}
        </div>
    );
};
