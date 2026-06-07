type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

type LogMeta = {
    label: string;
    variant: BadgeVariant;
    describe: (d: Record<string, unknown>) => string;
};

const text = (value: unknown, fallback = '—') =>
    value === undefined || value === null || value === '' ? fallback : String(value);

/* Configuração central de cada tipo de log: rótulo amigável, variante de badge
   (apenas variantes existentes) e descrição humanizada a partir dos detalhes. */
const LOG_META: Record<string, LogMeta> = {
    LOGIN: {
        label: 'Login',
        variant: 'secondary',
        describe: () => 'Acesso ao sistema.',
    },
    LOGOUT: {
        label: 'Logout',
        variant: 'outline',
        describe: () => 'Saída do sistema.',
    },
    UPLOAD_EXAME: {
        label: 'Exame cadastrado',
        variant: 'default',
        describe: (d) =>
            `Exame de ${text(d.nomePaciente)} cadastrado (protocolo ${text(d.protocolo)}).`,
    },
    REMOVER_EXAME: {
        label: 'Exame removido',
        variant: 'destructive',
        describe: (d) =>
            `Exame de ${text(d.nomePaciente)} removido (protocolo ${text(d.protocolo)}).`,
    },
    DOWNLOAD_RESULTADO: {
        label: 'Download de resultado',
        variant: 'secondary',
        describe: (d) => `Resultado do protocolo ${text(d.protocolo)} foi baixado.`,
    },
    WHATSAPP_ENVIADO: {
        label: 'WhatsApp enviado',
        variant: 'secondary',
        describe: (d) =>
            d.sucesso
                ? `Mensagem WhatsApp enviada (protocolo ${text(d.protocolo)}).`
                : `Falha ao enviar WhatsApp (protocolo ${text(d.protocolo)}).`,
    },
    CONFIGURACAO_ZAPI: {
        label: 'Configuração da Z-API alterada',
        variant: 'outline',
        describe: (d) =>
            `Integração Z-API ${d.ativo ? 'habilitada' : 'desabilitada'}.`,
    },
    CONFIGURACAO_FTP: {
        label: 'Configuração do FTP alterada',
        variant: 'outline',
        describe: (d) =>
            `Servidor FTP ${d.ativo ? 'habilitado' : 'desabilitado'} (${text(d.host)}).`,
    },
    CRIAR_USUARIO: {
        label: 'Usuário criado',
        variant: 'default',
        describe: (d) => `Usuário ${text(d.nome)} (@${text(d.usuario)}) foi criado.`,
    },
    EDITAR_USUARIO: {
        label: 'Usuário atualizado',
        variant: 'outline',
        describe: (d) => `Usuário ${text(d.nome)} (@${text(d.usuario)}) foi atualizado.`,
    },
    ATIVAR_USUARIO: {
        label: 'Usuário ativado',
        variant: 'secondary',
        describe: (d) => `Usuário ${text(d.nome)} foi ativado.`,
    },
    INATIVAR_USUARIO: {
        label: 'Usuário inativado',
        variant: 'destructive',
        describe: (d) => `Usuário ${text(d.nome)} foi inativado.`,
    },
};

export const logLabel = (tipo: string): string => LOG_META[tipo]?.label ?? tipo;

export const logVariant = (tipo: string): BadgeVariant => LOG_META[tipo]?.variant ?? 'outline';

export const describeLog = (tipo: string, detalhes: unknown): string => {
    const meta = LOG_META[tipo];
    if (!meta) return '—';
    const data = (detalhes && typeof detalhes === 'object' ? detalhes : {}) as Record<
        string,
        unknown
    >;
    return meta.describe(data);
};

/* Lista de tipos para o filtro de auditoria. */
export const LOG_TIPOS = Object.entries(LOG_META).map(([value, meta]) => ({
    value,
    label: meta.label,
}));
