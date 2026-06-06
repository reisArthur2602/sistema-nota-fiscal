'use server';

import { testFtpConnection } from '@/lib/ftp';
import { testZapiConnection } from '@/lib/zapi';
import prisma from '@/lib/prisma';
import { requirePermission } from '@/utils/require-permission';

/* ─── Z-API ─────────────────────────────────────────────────────── */

const ZAPI_KEY = 'zapi';

export type ZapiConfig = {
    instanceId: string;
    token: string;
    mensagem: string;
    ativo: boolean;
};

const ZAPI_DEFAULTS: ZapiConfig = {
    instanceId: '',
    token: '',
    mensagem:
        'Olá, {nome}! O resultado do seu exame (protocolo {protocolo}) está disponível. Acesse pelo link: {link}',
    ativo: false,
};

export const getZapiConfigAction = async (): Promise<ZapiConfig> => {
    await requirePermission(['SUPER_ADMIN']);

    const row = await prisma.configuracao.findUnique({ where: { chave: ZAPI_KEY } });

    if (!row?.valor) return ZAPI_DEFAULTS;
    return { ...ZAPI_DEFAULTS, ...(row.valor as Partial<ZapiConfig>) };
};

export const saveZapiConfigAction = async (
    data: ZapiConfig,
): Promise<{ success: boolean; message: string }> => {
    const session = await requirePermission(['SUPER_ADMIN']);

    await prisma.configuracao.upsert({
        where: { chave: ZAPI_KEY },
        create: { chave: ZAPI_KEY, valor: data },
        update: { valor: data },
    });

    await prisma.log.create({
        data: {
            tipo: 'CONFIGURACAO_ZAPI',
            usuarioId: session.id,
            detalhes: { ativo: data.ativo },
        },
    });

    return { success: true, message: 'Configurações salvas com sucesso.' };
};

export const testZapiConnectionAction = async (): Promise<{
    success: boolean;
    message: string;
}> => {
    await requirePermission(['SUPER_ADMIN']);

    const config = await getZapiConfigAction();

    if (!config.instanceId || !config.token) {
        return {
            success: false,
            message: 'Configure o Instance ID e o Token antes de testar a conexão.',
        };
    }

    return testZapiConnection(config.instanceId, config.token);
};

/* ─── FTP ───────────────────────────────────────────────────────── */

const FTP_KEY = 'ftp';

export type FtpConfig = {
    host: string;
    porta: number;
    usuario: string;
    senha: string;
    caminho: string;
    ativo: boolean;
};

const FTP_DEFAULTS: FtpConfig = {
    host: '',
    porta: 21,
    usuario: '',
    senha: '',
    caminho: '/uploads',
    ativo: false,
};

export const getFtpConfigAction = async (): Promise<FtpConfig> => {
    await requirePermission(['SUPER_ADMIN']);

    const row = await prisma.configuracao.findUnique({ where: { chave: FTP_KEY } });

    if (!row?.valor) return FTP_DEFAULTS;
    return { ...FTP_DEFAULTS, ...(row.valor as Partial<FtpConfig>) };
};

export const saveFtpConfigAction = async (
    data: FtpConfig,
): Promise<{ success: boolean; message: string }> => {
    const session = await requirePermission(['SUPER_ADMIN']);

    await prisma.configuracao.upsert({
        where: { chave: FTP_KEY },
        create: { chave: FTP_KEY, valor: data },
        update: { valor: data },
    });

    await prisma.log.create({
        data: {
            tipo: 'CONFIGURACAO_FTP',
            usuarioId: session.id,
            detalhes: { host: data.host, porta: data.porta, caminho: data.caminho, ativo: data.ativo },
        },
    });

    return { success: true, message: 'Configurações de FTP salvas com sucesso.' };
};

export const testFtpConnectionAction = async (): Promise<{
    success: boolean;
    message: string;
}> => {
    await requirePermission(['SUPER_ADMIN']);

    const config = await getFtpConfigAction();

    if (!config.host) {
        return { success: false, message: 'Configure o host antes de testar a conexão.' };
    }

    return testFtpConnection(config.host, config.porta);
};
