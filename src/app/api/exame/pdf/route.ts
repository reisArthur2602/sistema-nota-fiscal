import { type NextRequest, NextResponse } from 'next/server';

import { downloadFileFtp, type FtpConnectionConfig } from '@/lib/ftp';
import prisma from '@/lib/prisma';

export const GET = async (request: NextRequest) => {
    const cpf = request.nextUrl.searchParams.get('c');
    const protocolo = request.nextUrl.searchParams.get('p');

    if (!cpf || !protocolo) {
        return new NextResponse('Parâmetros inválidos.', { status: 400 });
    }

    const rawCpf = cpf.replace(/\D/g, '');

    const exame = await prisma.exame.findFirst({
        where: { cpf: rawCpf, protocolo, ativo: true },
        select: { caminhoArquivo: true, protocolo: true },
    });

    if (!exame) {
        return new NextResponse('Exame não encontrado ou inativo.', { status: 404 });
    }

    const ftpRow = await prisma.configuracao.findUnique({ where: { chave: 'ftp' } });
    const ftpConfig = ftpRow?.valor as {
        host: string;
        porta: number;
        usuario: string;
        senha: string;
        caminho: string;
        ativo: boolean;
    } | null;

    if (!ftpConfig?.host) {
        return new NextResponse('Configuração FTP não disponível.', { status: 503 });
    }

    const ftpConn: FtpConnectionConfig = {
        host: ftpConfig.host,
        porta: ftpConfig.porta,
        usuario: ftpConfig.usuario,
        senha: ftpConfig.senha,
        caminho: ftpConfig.caminho,
    };

    let buffer: Buffer;
    try {
        buffer = await downloadFileFtp(ftpConn, exame.caminhoArquivo);
    } catch {
        return new NextResponse('Arquivo não disponível no servidor FTP.', { status: 404 });
    }

    await prisma.log.create({
        data: {
            tipo: 'DOWNLOAD_RESULTADO',
            detalhes: { cpf: rawCpf, protocolo },
        },
    });

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="resultado-${exame.protocolo}.pdf"`,
            'Cache-Control': 'private, no-store',
        },
    });
};
