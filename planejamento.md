# Planejamento: Sistema de Emissão de Nota Fiscal

## Contexto

A clínica precisa de um sistema web interno que automatize o fluxo de solicitação e emissão de notas fiscais. Atualmente o processo é manual, o que gera retrabalho e risco de erros. O sistema deve permitir que recepcionistas iniciem a solicitação a partir de um `idregistro`, preenchendo dados vindos de uma API externa, e que a equipe de emissão processe, emita e envie a nota ao paciente por e-mail — com controle total de status e histórico.

---

## Usuários e Roles

Três roles principais:

| Role | Descrição |
|---|---|
| `SUPER_ADMIN` | Gerencia o sistema, usuários, roles e logs |
| `RECEPCAO` | Cria solicitações e acompanha o status |
| `EMISSOR` | Processa, emite e envia a nota fiscal |

### Permissões por Role

**SUPER_ADMIN**
- Cadastrar, editar, desativar usuários
- Definir roles
- Visualizar todas as solicitações
- Acessar logs do sistema
- Acessar configurações gerais

**RECEPCAO**
- Buscar dados pelo `idregistro`
- Preencher e corrigir campos do formulário
- Criar solicitação de emissão
- Visualizar as próprias solicitações
- Acompanhar status

**EMISSOR**
- Visualizar solicitações pendentes
- Conferir dados do paciente/cliente
- Emitir a nota fiscal
- Atualizar status da solicitação
- Enviar nota por e-mail
- Registrar observações e erros

---

## Modelo de Dados

### Entidade: `Usuario`
| Campo | Tipo | Notas |
|---|---|---|
| id | string | chave primária |
| nome | string | |
| email | string | único |
| senhaHash | string | |
| role | enum | SUPER_ADMIN, RECEPCAO, EMISSOR |
| ativo | boolean | padrão: true |
| criadoEm | datetime | |
| atualizadoEm | datetime | |

### Entidade: `Solicitacao`
| Campo | Tipo | Notas |
|---|---|---|
| id | string | chave primária |
| idRegistro | string | identificador vindo da API externa |
| data | datetime | data do exame/serviço |
| nome | string | |
| cpf | string | |
| endereco | string | |
| exame | string | serviço realizado |
| email | string? | opcional |
| telefone | string? | opcional |
| status | enum | ver abaixo |
| notaFiscalLink | string? | link ou caminho do arquivo |
| observacoes | string? | preenchido pelo emissor |
| criadoEm | datetime | |
| atualizadoEm | datetime | |
| criadoPorId | string | FK Usuario (RECEPCAO) |
| emitidoPorId | string? | FK Usuario (EMISSOR) |

### Entidade: `Log`
| Campo | Tipo | Notas |
|---|---|---|
| id | string | chave primária |
| usuarioId | string | FK Usuario |
| acao | string | ex: "SOLICITACAO_CRIADA", "STATUS_ATUALIZADO" |
| detalhes | string? | JSON com contexto adicional |
| criadoEm | datetime | |

### Enum: `Status`
| Valor | Significado |
|---|---|
| `PENDENTE` | Solicitação criada, aguardando processamento |
| `EM_ANALISE` | Emissor abriu e está conferindo |
| `EMITIDA` | Nota fiscal emitida |
| `ENVIADA_AO_PACIENTE` | E-mail enviado com sucesso |
| `CANCELADA` | Cancelada por qualquer motivo |
| `COM_ERRO` | Falha no processo de emissão ou envio |

---

## Fluxo da Recepção

1. Recepcionista acessa a tela de nova solicitação
2. Informa o `idregistro`
3. O sistema busca os dados na API externa — retorno esperado:
   ```typescript
   type RespostaRegistro = {
     data: Date;
     nome: string;
     cpf: string;
     endereco: string;
     exame: string;
     email?: string;
     telefone?: string;
   }
   ```
4. Os campos do formulário são preenchidos automaticamente
5. Os campos `email` e `telefone` ficam sempre editáveis (podem estar ausentes ou incorretos)
6. Recepcionista confere os dados e envia a solicitação
7. Solicitação criada com status `PENDENTE`

**Campos que podem ficar em aberto:** `email` e `telefone`

---

## Fluxo do Emissor

1. Emissor acessa a fila de solicitações (filtro padrão: PENDENTE)
2. Seleciona uma solicitação e visualiza todos os dados
3. Confere os dados do paciente/cliente
4. Emite a nota no sistema externo ou interno
5. Registra o link/arquivo da nota na solicitação
6. Atualiza o status para `EMITIDA`
7. Envia a nota por e-mail ao paciente
8. Atualiza o status para `ENVIADA_AO_PACIENTE`
9. Em caso de falha, registra observações e marca como `COM_ERRO`

---

## Telas do Sistema

### `/login`
- Campos: e-mail e senha
- Redirecionamento após login de acordo com o role

### `/recepcao` — Nova Solicitação
- Campo de busca por `idregistro`
- Formulário com preenchimento automático
- Botão de enviar solicitação

### `/recepcao/solicitacoes` — Histórico
- Tabela com solicitações criadas pelo usuário logado
- Colunas: ID Registro, Paciente, Exame, Status, Data de Criação
- Filtro por status
- Somente leitura

### `/emissor` — Fila de Solicitações
- Tabela com todas as solicitações
- Colunas: ID Registro, Paciente, CPF, Exame, Status, Data, Ações
- Filtros por status (padrão: PENDENTE + EM_ANALISE)

### `/emissor/:id` — Detalhes e Emissão
- Exibição completa dos dados da solicitação
- Campo para link/arquivo da nota fiscal
- Campo de observações
- Controle de status
- Botão "Marcar como Emitida"
- Botão "Enviar por E-mail" (habilitado após emissão)

### `/admin/usuarios` — Gestão de Usuários
- Tabela de usuários: Nome, E-mail, Role, Ativo
- Criar, editar, ativar/desativar usuários
- Definir role no formulário

### `/admin/logs` — Logs do Sistema
- Tabela: Usuário, Ação, Detalhes, Data/Hora
- Filtros por usuário, ação e período

---

## Comportamento Visual dos Status

| Status | Cor sugerida |
|---|---|
| PENDENTE | Cinza |
| EM_ANALISE | Amarelo |
| EMITIDA | Azul |
| ENVIADA_AO_PACIENTE | Verde |
| CANCELADA | Vermelho |
| COM_ERRO | Laranja |

---

## Variáveis de Ambiente Necessárias

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# API externa de registros
API_REGISTRO_URL=
API_REGISTRO_TOKEN=

# SMTP para envio de e-mail
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```
