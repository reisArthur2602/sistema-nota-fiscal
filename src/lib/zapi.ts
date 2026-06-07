const buildHeaders = (clientToken: string, json = false): Record<string, string> => ({
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(clientToken ? { 'Client-Token': clientToken } : {}),
});

export const testZapiConnection = async (
    instanceId: string,
    token: string,
    clientToken: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const res = await fetch(
            `https://api.z-api.io/instances/${instanceId}/token/${token}/status`,
            { cache: 'no-store', headers: buildHeaders(clientToken) }
        );

        if (!res.ok) {
            return {
                success: false,
                message: `Erro ${res.status}: credenciais inválidas ou instância não encontrada.`,
            };
        }

        const { connected } = (await res.json()) as {
            connected: true;
        };

        return {
            success: connected,
            message: connected
                ? 'Conexão estabelecida. WhatsApp conectado.'
                : 'Credenciais inválidas ou instância não encontrada.',
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
    clientToken: string,
    phone: string,
    message: string
): Promise<{ success: boolean; message: string }> => {
    const digits = phone.replace(/\D/g, '');
    const normalized = digits.startsWith('55') ? digits : `55${digits}`;

    try {
        const res = await fetch(
            `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
            {
                method: 'POST',
                headers: buildHeaders(clientToken, true),
                body: JSON.stringify({ phone: normalized, message }),
                cache: 'no-store',
            }
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
