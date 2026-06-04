export const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
