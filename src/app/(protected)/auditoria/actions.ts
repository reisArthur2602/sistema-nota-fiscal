'use server';

import prisma from '@/lib/prisma';
import { requirePermission } from '@/utils/require-permission';

const PER_PAGE = 15;

export const listarLogsAction = async (params: {
    tipo?: string;
    usuario?: string;
    page?: number;
}) => {
    await requirePermission(['SUPER_ADMIN']);

    const { tipo, usuario, page = 1 } = params;

    const where = {
        ...(tipo && { tipo }),
        ...(usuario && {
            usuario: {
                nome: { contains: usuario, mode: 'insensitive' as const },
            },
        }),
    };

    const [items, total] = await Promise.all([
        prisma.log.findMany({
            where,
            skip: (page - 1) * PER_PAGE,
            take: PER_PAGE,
            orderBy: { criadoEm: 'desc' },
            include: { usuario: { select: { nome: true } } },
        }),
        prisma.log.count({ where }),
    ]);

    return { items, total, page, perPage: PER_PAGE };
};
