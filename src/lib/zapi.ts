export const testZapiConnection = async (
    instanceId: string,
    token: string,
): Promise<{ success: boolean; message: string }> => {
    try {
        const res = await fetch(
            `https://api.z-api.io/instances/${instanceId}/token/${token}/status`,
            { cache: 'no-store' },
        );

        if (!res.ok) {
            return {
                success: false,
                message: `Erro ${res.status}: credenciais inválidas ou instância não encontrada.`,
            };
        }

        const json = (await res.json()) as { value?: { status?: string } };
        const connected = json?.value?.status === 'open';

        return {
            success: connected,
            message: connected
                ? 'Conexão estabelecida. WhatsApp conectado.'
                : 'Instância encontrada, mas o WhatsApp não está conectado. Escaneie o QR code no painel Z-API.',
        };
    } catch {
        return {
            success: false,
            message: 'Não foi possível conectar à Z-API. Verifique sua conexão com a internet.',
        };
    }
};

export const sendZapiMessage = async (
    instanceId: string,
    token: string,
    phone: string,
    message: string,
): Promise<{ success: boolean; message: string }> => {
    const digits = phone.replace(/\D/g, '');
    const normalized = digits.startsWith('55') ? digits : `55${digits}`;

    try {
        const res = await fetch(
            `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: normalized, message }),
                cache: 'no-store',
            },
        );

        if (!res.ok) {
            return {
                success: false,
                message: `Erro ao enviar mensagem: status ${res.status}.`,
            };
        }

        return { success: true, message: 'Mensagem WhatsApp enviada com sucesso.' };
    } catch {
        return {
            success: false,
            message: 'Não foi possível enviar a mensagem via Z-API.',
        };
    }
};
