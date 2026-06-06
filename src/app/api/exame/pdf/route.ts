import fs from 'fs/promises';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';

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
        select: { caminhoArquivo: true, fonte: true, protocolo: true, cpf: true },
    });

    if (!exame) {
        return new NextResponse('Exame não encontrado ou inativo.', { status: 404 });
    }

    let buffer: Buffer;

    if (exame.fonte === 'ftp') {
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

        try {
            buffer = await downloadFileFtp(ftpConn, exame.caminhoArquivo);
        } catch {
            return new NextResponse('Arquivo não disponível no servidor FTP.', { status: 404 });
        }
    } else {
        const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');
        const filepath = path.join(uploadDir, exame.caminhoArquivo);

        try {
            buffer = await fs.readFile(filepath);
        } catch {
            return new NextResponse('Arquivo não disponível.', { status: 404 });
        }
    }

    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null;

    await prisma.log.create({
        data: {
            tipo: 'DOWNLOAD_RESULTADO',
            ip,
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
