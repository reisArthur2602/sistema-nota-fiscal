# CLAUDE.md

## Objetivo deste arquivo

Este arquivo define os padrões obrigatórios do projeto.

O Claude Code deve seguir estas regras antes de criar, alterar ou refatorar qualquer parte do sistema.

---

# Regra principal

Este projeto deve seguir obrigatoriamente:

- **Next.js com App Router**
- **TypeScript**
- **Server Components por padrão**
- **shadcn/ui para componentes de interface**
- **Padrão novo do shadcn/ui com `Field`**
- **React Hook Form**
- **Zod**
- **@hookform/resolvers/zod**
- **@tanstack/react-query para mutations e queries client-side**
- **useMutation para submit de formulários**
- **Arrow functions**
- **Separação clara entre páginas server e componentes client**
- **Suspense e Skeletons para estados de loading em componentes que buscam dados**

---

# Componentes de UI

## Regra obrigatória

Sempre utilizar componentes do **shadcn/ui**.

Não criar manualmente componentes básicos como:

- `Button`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `RadioGroup`
- `Dialog`
- `DropdownMenu`
- `Card`
- `Table`
- `Badge`
- `Alert`
- `Tabs`
- `Sheet`
- `Popover`
- `Calendar`
- `Command`
- `Separator`
- `Skeleton`

Sempre reutilizar os componentes existentes em:

```txt
components/ui
```

ou:

```txt
src/components/ui
```

dependendo da estrutura do projeto.

Caso algum componente necessário não exista, instalar usando o shadcn/ui antes de criar manualmente.

Exemplo:

```bash
npx shadcn@latest add button input textarea select checkbox radio-group dialog dropdown-menu card table badge alert tabs sheet popover calendar command separator field skeleton
```

---

# Padrão de páginas no Next.js

Toda `page.tsx` deve ser **Server Component** por padrão.

Não adicionar `"use client"` diretamente em arquivos `page.tsx`, exceto se for extremamente necessário e bem justificado.

Quando a página precisar de interatividade, criar um componente separado.

Exemplo:

```txt
app/
└── login/
    ├── page.tsx
    └── login-form.tsx
```

Neste exemplo:

- `page.tsx` continua sendo Server Component.
- `login-form.tsx` será Client Component.

Exemplo de página server:

```tsx
import { LoginForm } from './login-form';

const LoginPage = () => {
    return (
        <main>
            <LoginForm />
        </main>
    );
};

export default LoginPage;
```

Exemplo de componente client:

```tsx
'use client';

export const LoginForm = () => {
    return <form>{/* campos aqui */}</form>;
};
```

---

# Arrow functions

Sempre usar **arrow functions** para:

- Componentes React
- Handlers
- Funções auxiliares
- Server Actions
- Funções de validação
- Funções de formatação

Correto:

```tsx
export const LoginForm = () => {
    return <div>Login</div>;
};
```

Errado:

```tsx
export function LoginForm() {
    return <div>Login</div>;
}
```

Correto:

```tsx
const handleSubmit = async () => {
    // lógica
};
```

Errado:

```tsx
async function handleSubmit() {
    // lógica
}
```

---

# Formulários

## Padrão obrigatório

Todos os formulários devem usar:

- `react-hook-form`
- `zod`
- `@hookform/resolvers/zod`
- Componentes do shadcn/ui
- Padrão novo com `Field`
- `useMutation` para submit

Não usar mais o padrão antigo baseado em:

- `Form`
- `FormField`
- `FormItem`
- `FormLabel`
- `FormControl`
- `FormMessage`

A menos que o projeto já esteja legado e seja necessário manter compatibilidade.

---

# Validação de formulários

A validação de formulário deve acontecer no **client** usando:

- `react-hook-form`
- `zod`
- `zodResolver`

Não repetir validação Zod dentro das Server Actions, salvo em casos extremamente necessários.

As Server Actions devem receber os dados já validados pelo client.

Atenção: mesmo com a validação do formulário no client, regras críticas de segurança devem continuar no servidor, como:

- Autenticação
- Permissão
- Role do usuário
- Vínculo com organização
- Vínculo com empresa
- Verificação de propriedade do registro
- Regras críticas de acesso
- Proteção contra alteração de dados de outro usuário

---

# Componentes obrigatórios para formulário

Sempre usar os componentes do shadcn/ui:

```tsx
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
```

E os componentes base necessários:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
```

Para outros campos, usar os componentes oficiais do shadcn/ui:

```tsx
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
```

---

# Validação com Zod

Todo formulário deve possuir um schema Zod no client.

O schema pode ficar próximo ao formulário quando for específico da tela.

Exemplo:

```tsx
const loginSchema = z.object({
    email: z.string().email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});
```

Quando o schema for reutilizável, criar em uma pasta própria, por exemplo:

```txt
src/
└── schemas/
    └── auth.schema.ts
```

ou dentro da feature:

```txt
app/
└── login/
    ├── page.tsx
    ├── login-form.tsx
    ├── login.schema.ts
    └── actions.ts
```

---

# React Hook Form com Zod Resolver

Sempre configurar o formulário com `zodResolver`.

Exemplo:

```tsx
const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        email: '',
        password: '',
    },
});
```

Sempre tipar os dados do formulário usando `z.infer`.

Exemplo:

```tsx
type LoginFormData = z.infer<typeof loginSchema>;
```

---

# Submit de formulários com useMutation

Todo formulário que envia dados para o servidor deve usar `useMutation`.

Não chamar Server Action diretamente no `onSubmit` sem mutation.

O padrão obrigatório é:

- Validar o formulário no client com `react-hook-form`, `zod` e `zodResolver`
- Submeter os dados usando `useMutation`
- Controlar loading pelo estado da mutation
- Exibir mensagens de sucesso ou erro
- Invalidar queries relacionadas quando necessário

Exemplo:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { loginAction } from './actions';

const loginSchema = z.object({
    email: z.string().email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const queryClient = useQueryClient();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const mutation = useMutation({
        mutationFn: loginAction,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['me'],
            });
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        {...form.register('email')}
                    />
                    <FieldError errors={[form.formState.errors.email]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        {...form.register('password')}
                    />
                    <FieldError errors={[form.formState.errors.password]} />
                </Field>

                {mutation.isError && (
                    <p className="text-sm text-destructive">
                        Não foi possível enviar o formulário.
                    </p>
                )}

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Enviando...' : 'Enviar'}
                </Button>
            </FieldGroup>
        </form>
    );
};
```

---

# Exemplo obrigatório de formulário

Este é o padrão que deve ser seguido ao criar formulários novos:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { loginAction } from './actions';

const loginSchema = z.object({
    email: z.string().email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const queryClient = useQueryClient();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const mutation = useMutation({
        mutationFn: loginAction,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['me'],
            });
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        {...form.register('email')}
                    />
                    <FieldError errors={[form.formState.errors.email]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        {...form.register('password')}
                    />
                    <FieldError errors={[form.formState.errors.password]} />
                </Field>

                {mutation.isError && (
                    <p className="text-sm text-destructive">
                        Não foi possível enviar o formulário.
                    </p>
                )}

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Entrando...' : 'Entrar'}
                </Button>
            </FieldGroup>
        </form>
    );
};
```

---

# Server Actions

Sempre que possível, usar **Server Actions** para ações do sistema.

As Server Actions devem:

- Receber os dados já validados pelo client
- Não repetir validação Zod dentro da action, salvo em casos extremamente necessários
- Manter validações de segurança no servidor
- Validar autenticação
- Validar permissões
- Validar vínculo com organização, empresa ou usuário quando existir
- Retornar mensagens claras de erro ou sucesso
- Usar arrow functions
- Ficar organizadas em arquivos próprios

A validação de formulário deve acontecer no client usando:

- `react-hook-form`
- `zod`
- `zodResolver`

O submit dos formulários deve ser feito usando `useMutation`, preferencialmente do `@tanstack/react-query`.

Exemplo de estrutura:

```txt
src/
└── actions/
    └── auth.ts
```

ou dentro da feature:

```txt
app/
└── login/
    ├── page.tsx
    ├── login-form.tsx
    ├── login.schema.ts
    └── actions.ts
```

Exemplo:

```tsx
'use server';

export const loginAction = async (data: { email: string; password: string }) => {
    // A validação de formato já deve ter sido feita no client.
    // Aqui ficam regras de segurança, autenticação, permissão e persistência.

    return {
        success: true,
        message: 'Login realizado com sucesso.',
    };
};
```

---

# Organização de arquivos

Componentes específicos de uma tela devem ficar próximos da própria rota.

Exemplo:

```txt
app/
└── login/
    ├── page.tsx
    ├── login-form.tsx
    ├── login.schema.ts
    └── actions.ts
```

Componentes reutilizáveis devem ficar em:

```txt
components/
```

ou:

```txt
src/components/
```

Componentes base do shadcn/ui devem ficar em:

```txt
components/ui/
```

ou:

```txt
src/components/ui/
```

---

# Padrão de importação

Usar imports com alias sempre que o projeto estiver configurado.

Preferir:

```tsx
import { Button } from '@/components/ui/button';
```

Evitar imports relativos longos como:

```tsx
import { Button } from '../../../../components/ui/button';
```

---

# Tabelas e listagens

Listagens que podem crescer devem possuir:

- Paginação
- Busca
- Filtros
- Ordenação quando fizer sentido
- Estado via query params
- Renderização server-side sempre que possível
- Loading com `Suspense` e `Skeleton`
- Empty state
- Error state

Para tabelas complexas, usar:

- `@tanstack/react-table`
- Componentes `Table` do shadcn/ui

Não criar tabela complexa manualmente sem necessidade.

---

# Query params

Filtros, busca e paginação devem ser refletidos na URL.

Exemplo:

```txt
/solicitacoes?page=1&search=joao&status=pendente
```

Isso facilita:

- Compartilhamento de links
- Atualização da página sem perder filtros
- Melhor organização da listagem
- Integração com Server Components

---

# Estados de carregamento e erro

Sempre tratar:

- Loading
- Empty state
- Error state
- Success feedback

Usar componentes do shadcn/ui sempre que possível:

- `Skeleton`
- `Alert`
- `Card`
- `Badge`
- `Button`

---

# Suspense e Skeletons

Todo componente, página, listagem, card, dashboard ou seção que busca dados deve possuir estado de carregamento bem definido.

Sempre que houver busca de dados, usar:

- `Suspense`
- `Skeleton` do shadcn/ui
- `loading.tsx` quando fizer sentido no App Router
- Componentes específicos de loading próximos da feature

Não deixar telas carregando sem feedback visual.

Não usar apenas textos simples como:

```tsx
<p>Carregando...</p>
```

Preferir sempre componentes visuais com `Skeleton`.

Quando a busca de dados estiver em Server Components, envolver o componente assíncrono com `Suspense` e criar um fallback com `Skeleton`.

Exemplo:

```tsx
import { Suspense } from 'react';

import { ExamsList } from './exams-list';
import { ExamsListSkeleton } from './exams-list-skeleton';

const ExamsPage = () => {
    return (
        <Suspense fallback={<ExamsListSkeleton />}>
            <ExamsList />
        </Suspense>
    );
};

export default ExamsPage;
```

Exemplo de skeleton:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export const ExamsListSkeleton = () => {
    return (
        <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
};
```

Para listagens, tabelas, cards e dashboards, o skeleton deve representar visualmente o layout real da tela.

Exemplo para tabela:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export const ExamsTableSkeleton = () => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="rounded-md border">
                <div className="space-y-2 p-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        </div>
    );
};
```

Quando usar `loading.tsx`, o arquivo deve seguir o mesmo padrão visual da tela carregada.

Exemplo:

```tsx
import { ExamsTableSkeleton } from './exams-table-skeleton';

const Loading = () => {
    return <ExamsTableSkeleton />;
};

export default Loading;
```

Também tratar sempre:

- Empty state
- Error state
- Loading state
- Success feedback

---

# Regras de código

- Usar TypeScript corretamente
- Evitar `any`
- Não duplicar componentes existentes
- Não criar helpers repetidos
- Não criar estilos inline sem necessidade
- Preferir Tailwind CSS
- Manter componentes pequenos e organizados
- Separar lógica de UI quando necessário
- Antes de criar algo novo, verificar se já existe componente, helper, schema ou action reutilizável

---

# Regras de UI

- Interface limpa, profissional e responsiva
- Usar espaçamentos consistentes
- Usar componentes do shadcn/ui
- Usar `Card` para agrupar informações
- Usar `Badge` para status
- Usar `DropdownMenu` para ações
- Usar `Dialog` ou `AlertDialog` para confirmações
- Usar `Table` para listagens
- Usar `Skeleton` para carregamento
- Usar `Alert` para mensagens importantes
- Skeletons devem parecer com o layout final da tela

---

# Regras de autenticação e permissões

Quando houver autenticação:

- Usar login e senha
- Validar permissões no servidor
- Não esconder apenas no frontend
- Roles devem ser verificadas antes de executar ações protegidas
- Rotas privadas devem validar sessão no server
- Server Actions protegidas devem validar sessão no server
- Server Actions protegidas devem validar permissão no server

---

# Logs e auditoria

Toda ação importante deve registrar:

- Usuário responsável
- Tipo da ação
- Entidade afetada
- Data e hora
- Dados relevantes da alteração
- IP ou origem, quando disponível

Exemplos de ações auditáveis:

- Login
- Logout
- Criação de registro
- Edição de registro
- Exclusão ou inativação
- Mudança de status
- Envio de e-mail
- Emissão de nota
- Alteração de permissões

---

# Checklist antes de finalizar qualquer tarefa

Antes de finalizar uma alteração, verificar:

- A `page.tsx` permaneceu como Server Component?
- A interatividade foi separada em componente client?
- Foram usados componentes do shadcn/ui?
- Foi usado o padrão novo com `Field` em formulários?
- Foi usado React Hook Form?
- Foi usado Zod?
- Foi usado `zodResolver`?
- A validação do formulário ficou no client?
- A Server Action não está repetindo validação Zod desnecessária?
- A Server Action valida autenticação e permissão quando necessário?
- O submit do formulário está usando `useMutation`?
- O loading do submit está usando `mutation.isPending`?
- Erros de submit foram tratados?
- Queries relacionadas foram invalidadas após sucesso, quando necessário?
- Foram usadas arrow functions?
- Não foi criado botão/input/card/modal manualmente?
- Não há `any` desnecessário?
- As listagens grandes possuem busca, filtros e paginação?
- Os filtros importantes foram para query params?
- Componentes que buscam dados usam `Suspense`?
- Foi criado fallback com `Skeleton` do shadcn/ui?
- Existe `loading.tsx` quando fizer sentido no App Router?
- O skeleton representa o layout real da tela?
- Não foi usado apenas texto simples como `Carregando...`?
- Empty state foi tratado?
- Error state foi tratado?
- Success feedback foi tratado?
- O código ficou organizado e fácil de manter?

---

# Resumo obrigatório

Sempre seguir estes padrões:

- `page.tsx` server por padrão
- Client component separado quando necessário
- shadcn/ui para todos os componentes de interface
- Nunca inventar `Button`, `Input`, `Card`, `Dialog`, `Table`, etc.
- Formulários com `Field`
- React Hook Form
- Zod
- `zodResolver`
- Validação de formulários no client
- Server Actions sem validação Zod duplicada, salvo necessidade real
- Server Actions com validação de autenticação e permissão quando necessário
- Submits de formulários usando `useMutation`
- Loading de submit usando `mutation.isPending`
- Arrow functions
- TypeScript sem `any` desnecessário
- Listagens com filtros, busca, paginação e query params
- Componentes que buscam dados devem usar `Suspense`
- Estados de loading devem usar `Skeleton` do shadcn/ui
- `loading.tsx` deve ser usado quando fizer sentido no App Router
