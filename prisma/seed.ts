import bcrypt from 'bcrypt';
import 'dotenv/config';

import { Role } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';

const main = async () => {
    const usuario = process.env.SEED_ADMIN_EMAIL ?? 'admin';
    const senha = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';

    const senhaHash = await bcrypt.hash(senha, 12);

    const admin = await prisma.usuario.upsert({
        where: { usuario },
        update: {},
        create: {
            nome: 'Administrador',
            usuario,
            senhaHash,
            role: Role.SUPER_ADMIN,
            ativo: true,
        },
    });

    console.log(`Usuário admin criado: ${admin.usuario} (role: ${admin.role})`);
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
