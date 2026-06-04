import { listarSolicitacoes } from './actions';
import { EmissorTable } from './emissor-table';
import { StatusFilter } from './status-filter';

type Props = { status?: string };

export const EmissorContent = async ({ status }: Props) => {
    const solicitacoes = await listarSolicitacoes(status);

    return (
        <>
            <StatusFilter statusAtual={status} />
            <EmissorTable solicitacoes={solicitacoes} />
        </>
    );
};
