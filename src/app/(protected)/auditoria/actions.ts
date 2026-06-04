'use server';

import { PER_PAGE } from '@/constants';
import { AcaoLog } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';
import { requirePermission } from '@/utils/require-permission';

type FiltroLogs = {
    usuario?: string;
    acao?: string;
    periodo?: string;
    page?: number;
};

export const listarLogs = async ({ usuario, acao, periodo, page = 1 }: FiltroLogs = {}) => {
    await requirePermission(['SUPER_ADMIN']);

    const corte = (() => {
        if (!periodo || periodo === 'todos') return undefined;
        const data = new Date();
        if (periodo === 'hoje') data.setHours(0, 0, 0, 0);
        else data.setDate(data.getDate() - (periodo === '7d' ? 7 : 30));
        return data;
    })();

    const where = {
        ...(usuario && {
            OR: [
                { usuarioNome: { contains: usuario, mode: 'insensitive' as const } },
                { usuarioLogin: { contains: usuario, mode: 'insensitive' as const } },
            ],
        }),
        ...(acao && { acao: acao as AcaoLog }),
        ...(corte && { criadoEm: { gte: corte } }),
    };

    const [items, total] = await Promise.all([
        prisma.log.findMany({
            where,
            select: {
                id: true,
                usuarioNome: true,
                usuarioLogin: true,
                acao: true,
                detalhes: true,
                criadoEm: true,
            },
            orderBy: { criadoEm: 'desc' },
            take: PER_PAGE,
            skip: (page - 1) * PER_PAGE,
        }),
        prisma.log.count({ where }),
    ]);

    return { items, total, page, perPage: PER_PAGE };
};
