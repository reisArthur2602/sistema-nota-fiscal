
import { Solicitacao } from '@/generated/prisma/client';
import { formatDate } from './format-date';

export const buildMensagem = (s: Solicitacao, link: string) =>
    `Olá, ${s.nome}.

Sua nota fiscal referente à especialidade "${s.especialidade}", realizado em ${formatDate(s.data)}, já está disponível para acesso.

Acesse sua nota pelo link:
${link}

Atenciosamente,
Equipe NotaFácil`;
