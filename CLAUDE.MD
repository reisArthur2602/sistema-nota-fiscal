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
- **Arrow functions**
- **Separação clara entre páginas server e componentes client**

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
npx shadcn@latest add button input textarea select checkbox radio-group dialog dropdown-menu card table badge alert tabs sheet popover calendar command separator field
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

Não usar mais o padrão antigo baseado em:

- `Form`
- `FormField`
- `FormItem`
- `FormLabel`
- `FormControl`
- `FormMessage`

A menos que o projeto já esteja legado e seja necessário manter compatibilidade.

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

Todo formulário deve possuir um schema Zod.

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

# Exemplo obrigatório de formulário

Este é o padrão que deve ser seguido ao criar formulários novos:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
    email: z.string().email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        console.log(data);
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

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
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

- Validar os dados recebidos com Zod.
- Não confiar apenas na validação do client.
- Retornar mensagens claras de erro ou sucesso.
- Usar arrow functions.
- Ficar organizadas em arquivos próprios.

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

import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export const loginAction = async (data: unknown) => {
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: 'Dados inválidos.',
            errors: parsed.error.flatten().fieldErrors,
        };
    }

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

# Regras de código

- Usar TypeScript corretamente.
- Evitar `any`.
- Não duplicar componentes existentes.
- Não criar helpers repetidos.
- Não criar estilos inline sem necessidade.
- Preferir Tailwind CSS.
- Manter componentes pequenos e organizados.
- Separar lógica de UI quando necessário.
- Antes de criar algo novo, verificar se já existe componente, helper, schema ou action reutilizável.

---

# Regras de UI

- Interface limpa, profissional e responsiva.
- Usar espaçamentos consistentes.
- Usar componentes do shadcn/ui.
- Usar `Card` para agrupar informações.
- Usar `Badge` para status.
- Usar `DropdownMenu` para ações.
- Usar `Dialog` ou `AlertDialog` para confirmações.
- Usar `Table` para listagens.
- Usar `Skeleton` para carregamento.
- Usar `Alert` para mensagens importantes.

---

# Regras de autenticação e permissões

Quando houver autenticação:

- Usar login e senha.
- Validar permissões no servidor.
- Não esconder apenas no frontend.
- Roles devem ser verificadas antes de executar ações protegidas.
- Rotas privadas devem validar sessão no server.

---

# Logs e auditoria

Toda ação importante deve registrar:

- Usuário responsável.
- Tipo da ação.
- Entidade afetada.
- Data e hora.
- Dados relevantes da alteração.
- IP ou origem, quando disponível.

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
- Foram usadas arrow functions?
- Não foi criado botão/input/card/modal manualmente?
- Não há `any` desnecessário?
- A validação também acontece no servidor?
- As listagens grandes possuem busca, filtros e paginação?
- Os filtros importantes foram para query params?
- O código ficou organizado e fácil de manter?

---

# Resumo obrigatório

Sempre seguir estes padrões:

- `page.tsx` server por padrão.
- Client component separado quando necessário.
- shadcn/ui para todos os componentes de interface.
- Nunca inventar `Button`, `Input`, `Card`, `Dialog`, `Table`, etc.
- Formulários com `Field`.
- React Hook Form.
- Zod.
- `zodResolver`.
- Arrow functions.
- TypeScript sem `any` desnecessário.
- Server Actions com validação no servidor.
- Listagens com filtros, busca, paginação e query params.
