'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Role, Usuario } from '@/generated/prisma/browser';
import { criarUsuario, editarUsuario, toggleAtivo } from './actions';

export type UsuarioRow = Pick<Usuario, 'id' | 'nome' | 'usuario' | 'role' | 'ativo'>;

const roleConfig: Record<Role, { label: string; className: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', className: '' },
    RECEPCAO: {
        label: 'Recepção',
        className: 'border-border bg-transparent text-muted-foreground',
    },
    EMISSOR: {
        label: 'Emissor',
        className: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
};

const usuarioSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório.'),
    usuario: z.string().min(3, 'Usuario deve ter no minimo 3 caracteres.'),
    senha: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'RECEPCAO', 'EMISSOR']),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

export const EquipeTable = ({ usuarios: inicial }: { usuarios: UsuarioRow[] }) => {
    const [usuarios, setUsuarios] = useState<UsuarioRow[]>(inicial);
    const [formAberto, setFormAberto] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<UsuarioRow | null>(null);

    const form = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: { nome: '', usuario: '', senha: '', role: 'RECEPCAO' },
    });

    const abrirCriar = () => {
        setUsuarioEditando(null);
        form.reset({ nome: '', usuario: '', senha: '', role: 'RECEPCAO' });
        setFormAberto(true);
    };

    const abrirEditar = (usuario: UsuarioRow) => {
        setUsuarioEditando(usuario);
        form.reset({ nome: usuario.nome, usuario: usuario.usuario, senha: '', role: usuario.role });
        setFormAberto(true);
    };

    const handleFormClose = (open: boolean) => {
        if (!open) {
            form.reset();
            setUsuarioEditando(null);
        }
        setFormAberto(open);
    };

    const handleToggleAtivo = async (usuario: UsuarioRow) => {
        const resultado = await toggleAtivo(usuario.id, !usuario.ativo);
        if (!resultado.success) {
            toast.error(resultado.message);
            return;
        }
        setUsuarios((prev) =>
            prev.map((u) => (u.id === usuario.id ? { ...u, ativo: !u.ativo } : u))
        );
        toast.success(resultado.message);
    };

    const onSubmit = async (data: UsuarioFormData) => {
        if (!usuarioEditando && (!data.senha || data.senha.length < 6)) {
            form.setError('senha', { message: 'A senha deve ter no mínimo 6 caracteres.' });
            return;
        }

        if (usuarioEditando) {
            const resultado = await editarUsuario(usuarioEditando.id, data);
            if (!resultado.success) {
                toast.error(resultado.message);
                return;
            }
            setUsuarios((prev) =>
                prev.map((u) =>
                    u.id === usuarioEditando.id
                        ? { ...u, nome: data.nome, usuario: data.usuario, role: data.role }
                        : u
                )
            );
            toast.success(resultado.message);
        } else {
            const resultado = await criarUsuario(data);
            if (!resultado.success) {
                toast.error(resultado.message);
                return;
            }
            setUsuarios((prev) => [
                ...prev,
                {
                    id: `usr-${Date.now()}`,
                    nome: data.nome,
                    usuario: data.usuario,
                    role: data.role,
                    ativo: true,
                },
            ]);
            toast.success(resultado.message);
        }

        form.reset();
        setFormAberto(false);
        setUsuarioEditando(null);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Equipe</h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie os usuários e perfis de acesso
                    </p>
                </div>
                <Button onClick={abrirCriar}>
                    <Plus className="size-4" />
                    Novo usuário
                </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Perfil</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usuarios.map((u) => {
                            const role = roleConfig[u.role];
                            return (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <p className="font-medium">{u.nome}</p>
                                        <p className="text-xs text-muted-foreground">
                                            @{u.usuario}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={role.className}>{role.label}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {u.ativo ? (
                                            <Badge className="border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400">
                                                Ativo
                                            </Badge>
                                        ) : (
                                            <Badge className="border-border bg-transparent text-muted-foreground">
                                                Inativo
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon-sm">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => abrirEditar(u)}>
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => handleToggleAtivo(u)}
                                                >
                                                    {u.ativo ? 'Desativar' : 'Ativar'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={formAberto} onOpenChange={handleFormClose}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>
                                {usuarioEditando ? 'Editar usuário' : 'Novo usuário'}
                            </DialogTitle>
                            <DialogDescription>
                                {usuarioEditando
                                    ? 'Atualize os dados do usuário.'
                                    : 'Preencha os dados para criar um novo usuário.'}
                            </DialogDescription>
                        </DialogHeader>

                        <FieldGroup className="py-4">
                            <Field>
                                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                                <Input
                                    id="nome"
                                    placeholder="Nome completo"
                                    {...form.register('nome')}
                                />
                                <FieldError errors={[form.formState.errors.nome]} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="usuario">Nome de usuario</FieldLabel>
                                <Input
                                    id="usuario"
                                    type="text"
                                    placeholder="nome.sobrenome"
                                    {...form.register('usuario')}
                                />
                                <FieldError errors={[form.formState.errors.usuario]} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="senha">Senha</FieldLabel>
                                <Input
                                    id="senha"
                                    type="password"
                                    placeholder="••••••••"
                                    {...form.register('senha')}
                                />
                                {usuarioEditando && (
                                    <FieldDescription>
                                        Deixe em branco para não alterar.
                                    </FieldDescription>
                                )}
                                <FieldError errors={[form.formState.errors.senha]} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="role">Perfil</FieldLabel>
                                <Controller
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="role" className="w-full">
                                                <SelectValue placeholder="Selecione um perfil" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SUPER_ADMIN">
                                                    Super Admin
                                                </SelectItem>
                                                <SelectItem value="RECEPCAO">Recepção</SelectItem>
                                                <SelectItem value="EMISSOR">Emissor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError errors={[form.formState.errors.role]} />
                            </Field>
                        </FieldGroup>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Spinner />}
                                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
