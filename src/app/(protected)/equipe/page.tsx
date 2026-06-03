import type { Metadata } from 'next';

import { listarUsuarios } from './actions';
import { EquipeTable, type Usuario } from './equipe-table';

export const metadata: Metadata = {
    title: 'Equipe',
};

const EquipePage = async () => {
    const usuarios = await listarUsuarios();

    return (
        <div className="space-y-6">
            <EquipeTable usuarios={usuarios as Usuario[]} />
        </div>
    );
};

export default EquipePage;
