import { listarSolicitacoes } from './actions';
import { EmissorTable } from './emissor-table';

export const EmissorContent = async () => {
    const solicitacoes = await listarSolicitacoes();
    return <EmissorTable solicitacoes={solicitacoes} />;
};
