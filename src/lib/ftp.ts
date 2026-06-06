import { Readable } from 'stream';
import { PassThrough } from 'stream';
import { Socket } from 'net';

import * as ftp from 'basic-ftp';

export type FtpConnectionConfig = {
    host: string;
    porta: number;
    usuario: string;
    senha: string;
    caminho: string;
};

const createClient = async (config: FtpConnectionConfig): Promise<ftp.Client> => {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    await client.access({
        host: config.host,
        port: config.porta,
        user: config.usuario,
        password: config.senha,
        secure: false,
    });
    return client;
};

export const uploadFileFtp = async (
    config: FtpConnectionConfig,
    buffer: Buffer,
    filename: string,
): Promise<{ success: boolean; remotePath: string; message: string }> => {
    const remotePath = `${config.caminho.replace(/\/$/, '')}/${filename}`;
    const client = await createClient(config);
    try {
        const readable = Readable.from(buffer);
        await client.ensureDir(config.caminho);
        await client.uploadFrom(readable, remotePath);
        return { success: true, remotePath, message: 'Arquivo enviado ao FTP com sucesso.' };
    } finally {
        client.close();
    }
};

export const downloadFileFtp = async (
    config: FtpConnectionConfig,
    remotePath: string,
): Promise<Buffer> => {
    const client = await createClient(config);
    try {
        const passThrough = new PassThrough();
        const chunks: Buffer[] = [];
        passThrough.on('data', (chunk: Buffer) => chunks.push(chunk));
        const done = new Promise<void>((resolve, reject) => {
            passThrough.on('end', resolve);
            passThrough.on('error', reject);
        });
        await client.downloadTo(passThrough, remotePath);
        await done;
        return Buffer.concat(chunks);
    } finally {
        client.close();
    }
};

export const testFtpConnection = async (
    host: string,
    porta: number,
): Promise<{ success: boolean; message: string }> => {
    const reachable = await new Promise<boolean>((resolve) => {
        const socket = new Socket();
        socket.setTimeout(5000);
        socket.on('connect', () => { socket.destroy(); resolve(true); });
        socket.on('timeout', () => { socket.destroy(); resolve(false); });
        socket.on('error', () => resolve(false));
        socket.connect(porta, host);
    });

    if (!reachable) {
        return {
            success: false,
            message: `Não foi possível alcançar ${host}:${porta}. Verifique o host, a porta e o firewall.`,
        };
    }

    return {
        success: true,
        message: `Servidor FTP alcançável em ${host}:${porta}. Credenciais não foram validadas — apenas a conectividade TCP foi testada.`,
    };
};
