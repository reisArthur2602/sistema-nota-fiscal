'use server';

import { AcaoLog } from '@/generated/prisma/enums';
import { requirePermission } from '@/utils/require-permission';
import prisma from '@/lib/prisma';

type FiltroLogs = {
    usuario?: string;
    acao?: string;
    periodo?: string;
};

export const listarLogs = async ({ usuario, acao, periodo }: FiltroLogs = {}) => {
    await requirePermission(['SUPER_ADMIN']);

    const corte = (() => {
        if (!periodo || periodo === 'todos') return undefined;
        const data = new Date();
        if (periodo === 'hoje') data.setHours(0, 0, 0, 0);
        else data.setDate(data.getDate() - (periodo === '7d' ? 7 : 30));
        return data;
    })();

    return prisma.log.findMany({
        where: {
            ...(usuario && {
                OR: [
                    { usuarioNome: { contains: usuario, mode: 'insensitive' } },
                    { usuarioLogin: { contains: usuario, mode: 'insensitive' } },
                ],
            }),
            ...(acao && { acao: acao as AcaoLog }),
            ...(corte && { criadoEm: { gte: corte } }),
        },
        select: {
            id: true,
            usuarioNome: true,
            usuarioLogin: true,
            acao: true,
            detalhes: true,
            criadoEm: true,
        },
        orderBy: { criadoEm: 'desc' },
    });
};
