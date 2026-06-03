'use server';

import { mockLogs } from '@/lib/mocks';

type FiltroLogs = {
    usuario?: string;
    acao?: string;
    periodo?: string;
};

export const listarLogs = async ({ usuario, acao, periodo }: FiltroLogs = {}) => {
    let logs = [...mockLogs];

    if (usuario) {
        const termo = usuario.toLowerCase();
        logs = logs.filter(
            (l) =>
                l.usuarioNome.toLowerCase().includes(termo) ||
                l.usuarioLogin.toLowerCase().includes(termo),
        );
    }

    if (acao) {
        logs = logs.filter((l) => l.acao === acao);
    }

    if (periodo && periodo !== 'todos') {
        const agora = new Date();
        const dias = periodo === 'hoje' ? 0 : periodo === '7d' ? 7 : 30;
        const corte = new Date(agora);
        corte.setDate(corte.getDate() - dias);
        corte.setHours(0, 0, 0, 0);
        logs = logs.filter((l) => new Date(l.criadoEm) >= corte);
    }

    return logs;
};
