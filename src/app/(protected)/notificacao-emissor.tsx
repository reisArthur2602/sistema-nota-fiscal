'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { contarPendentes } from './emissor/actions';

const INTERVALO_MS = 8000;

export const NotificacaoEmissor = () => {
    const totalAnterior = useRef<number | null>(null);

    useEffect(() => {
        let ativo = true;

        const verificar = async () => {
            try {
                const total = await contarPendentes();
                if (!ativo) return;

                if (totalAnterior.current !== null && total > totalAnterior.current) {
                    const novas = total - totalAnterior.current;
                    toast.info(
                        novas === 1
                            ? 'Nova solicitação na fila'
                            : `${novas} novas solicitações na fila`,
                        { description: 'Acesse a fila de emissão para conferir.' },
                    );
                }

                totalAnterior.current = total;
            } catch {
                // silencioso: tenta novamente no proximo ciclo
            }
        };

        verificar();
        const id = setInterval(verificar, INTERVALO_MS);

        return () => {
            ativo = false;
            clearInterval(id);
        };
    }, []);

    return null;
};
