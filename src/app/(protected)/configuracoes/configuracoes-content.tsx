import { HardDrive, MessageCircle } from 'lucide-react';

import { getFtpConfigAction, getZapiConfigAction } from './actions';
import { FtpForm } from './ftp-form';
import { ZapiForm } from './zapi-form';

export const ConfiguracoesContent = async () => {
    const [zapiConfig, ftpConfig] = await Promise.all([
        getZapiConfigAction(),
        getFtpConfigAction(),
    ]);

    return (
        <div className="space-y-6">
            {/* Z-API */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                        <MessageCircle className="size-4 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">
                            Integração Z-API / WhatsApp
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Configure o envio automático de mensagens aos pacientes quando um
                            resultado for cadastrado.
                        </p>
                    </div>
                </div>
                <div className="px-6 py-6">
                    <ZapiForm config={zapiConfig} />
                </div>
            </div>

            {/* FTP */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <HardDrive className="size-4 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Servidor FTP</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Configure o servidor FTP remoto para armazenamento dos arquivos de
                            exame. Quando habilitado, substitui o diretório local.
                        </p>
                    </div>
                </div>
                <div className="px-6 py-6">
                    <FtpForm config={ftpConfig} />
                </div>
            </div>
        </div>
    );
};
