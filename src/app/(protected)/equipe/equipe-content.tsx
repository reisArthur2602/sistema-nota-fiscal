import { listarUsuarios } from './actions';
import { EquipeTable } from './equipe-table';

export const EquipeContent = async () => {
    const usuarios = await listarUsuarios();

    return <EquipeTable usuarios={usuarios} />;
};
