'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { contarPendentes } from './emissor/actions';

export const NotificacaoEmissor = () => {
    const totalAnterior = useRef<number | null>(null);

    const { data: total } = useQuery({
        queryKey: ['pendentes-count'],
        queryFn: contarPendentes,
        refetchInterval: 60000,
        refetchIntervalInBackground: false,
    });

    useEffect(() => {
        if (total === undefined) return;

        if (totalAnterior.current !== null && total > totalAnterior.current) {
            const novas = total - totalAnterior.current;
            toast.info(
                novas === 1 ? 'Nova solicitação na fila' : `${novas} novas solicitações na fila`,
                { description: 'Acesse a fila de emissão para conferir.' }
            );
        }

        totalAnterior.current = total;
    }, [total]);

    return null;
};
