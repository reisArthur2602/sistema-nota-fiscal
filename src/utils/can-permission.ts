import type { Role } from '@/generated/prisma/enums';

export const canPermission = (role: Role, allowed: Role[]): boolean => {
    return allowed.includes(role);
};
