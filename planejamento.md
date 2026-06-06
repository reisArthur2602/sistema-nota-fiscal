# MeuExame — Planejamento de Funcionalidades

## Visão Geral

Plataforma para distribuição digital de resultados de exames. Profissionais de saúde cadastram os resultados e os pacientes acessam via link direto, sem necessidade de cadastro.

---

## Atores

| Ator | Descrição |
|------|-----------|
| **Paciente** | Acessa o resultado via link público com CPF e protocolo. Não precisa criar conta. |
| **LAUDO** | Profissional responsável por cadastrar e enviar os resultados dos exames. |
| **SUPER_ADMIN** | Administrador com acesso total à plataforma. |

---

## Módulos e Funcionalidades

### 1. Acesso do Paciente (público)

**Rota:** `/exame?c={cpf}&p={protocolo}`

- O paciente recebe o link por e-mail, SMS ou impresso.
- Ao acessar, o sistema valida o CPF (`c`) e o protocolo (`p`) informados na URL.
- **Exame encontrado:** exibe os dados do resultado (nome do paciente, data do exame) e botão para baixar o PDF.
- **Exame não encontrado / inválido:** exibe mensagem de erro clara orientando o paciente a entrar em contato com a clínica.
- O acesso ao PDF é registrado em auditoria (IP, data/hora).
- Não há login, cadastro ou senha para o paciente.

---

### 2. Autenticação (interno)

**Rota:** `/login`

- Formulário de login com usuário e senha.
- Validação de credenciais no servidor.
- Sessão autenticada via JWT armazenado em cookie.
- Redirecionamento automático para o painel após login.
- Logout com encerramento da sessão.
- Todos os acessos ao sistema interno exigem autenticação.

---

### 3. Upload de Exames

**Rota:** `/upload`  
**Acesso:** LAUDO, SUPER_ADMIN

- Formulário com os campos:
  - **CPF do paciente** (somente números, 11 dígitos)
  - **Nome do paciente**
  - **Protocolo** (identificador único do exame)
  - **Arquivo PDF** com o resultado do exame
- Validações no cliente:
  - CPF com formato válido
  - Protocolo obrigatório
  - Arquivo obrigatório, somente PDF, limite de tamanho
- Ao enviar:
  - O PDF é salvo em uma pasta configurada no FTP
  - Os dados são persistidos no banco de dados
  - O sistema gera e exibe o link de acesso do paciente
- Possibilidade de copiar o link gerado diretamente da tela de confirmação.
- Registro em auditoria: quem cadastrou, quando, qual protocolo.

---

### 4. Gestão de Exames

**Rota:** `/exames`  
**Acesso:** SUPER_ADMIN

- Listagem de todos os exames cadastrados na plataforma.
- Filtros disponíveis:
  - Por CPF do paciente
  - Por nome do paciente
  - Por protocolo
  - Por período (data de cadastro)
  - Por usuário que cadastrou
- Busca por texto livre (nome ou protocolo).
- Paginação com controle de registros por página.
- Ações por exame:
  - **Visualizar link:** exibe o link público do paciente.
  - **Substituir PDF:** permite reenviar um arquivo corrigido (mantém o mesmo protocolo e link).
  - **Inativar exame:** torna o link inacessível ao paciente sem excluir o registro.
  - **Reativar exame:** reabilita o acesso ao paciente.

---

### 5. Gestão de Equipe

**Rota:** `/equipe`  
**Acesso:** SUPER_ADMIN

- Listagem de todos os usuários do sistema.
- Filtros: por nome, por role, por status (ativo/inativo).
- Ações:
  - **Criar usuário:** formulário com nome, usuário (login), senha inicial e role (SUPER_ADMIN ou LAUDO).
  - **Editar usuário:** alterar nome, role ou redefinir senha.
  - **Ativar / Inativar usuário:** controle de acesso sem excluir o registro.
- Regras:
  - Não é possível inativar o próprio usuário logado.
  - Não é possível ter zero SUPER_ADMINs ativos.

---

### 6. Auditoria

**Rota:** `/auditoria`  
**Acesso:** SUPER_ADMIN

- Log completo de todas as ações relevantes do sistema.
- Informações registradas por evento:
  - Usuário responsável (ou "Paciente" para acessos públicos)
  - Tipo da ação
  - Data e hora
  - IP de origem
  - Detalhes do evento
- Tipos de ação auditados:
  - Login e logout de usuários internos
  - Cadastro de exame
  - Substituição de PDF
  - Inativação / reativação de exame
  - Download do resultado pelo paciente
  - Criação, edição, ativação e inativação de usuários
- Filtros disponíveis:
  - Por tipo de ação
  - Por usuário responsável
  - Por período
- Paginação server-side (volume crescente de registros).
- Dados de auditoria são somente leitura — não é possível excluí-los.

---

## Modelos de Dados

### Exame
| Campo | Descrição |
|-------|-----------|
| id | Identificador único |
| cpf | CPF do paciente |
| nomePaciente | Nome completo do paciente |
| protocolo | Código único do exame (usado na URL) |
| caminhoArquivo | Caminho do PDF no FTP |
| ativo | Se o link está acessível pelo paciente |
| criadoPor | Usuário que cadastrou o exame |
| criadoEm | Data e hora do cadastro |
| atualizadoEm | Data da última modificação |

### Log (Auditoria)
| Campo | Descrição |
|-------|-----------|
| id | Identificador único |
| tipo | Tipo da ação (ex: LOGIN, UPLOAD_EXAME, DOWNLOAD_RESULTADO) |
| usuarioId | Usuário interno responsável (nullable para ações do paciente) |
| ip | IP de origem |
| detalhes | JSON com dados contextuais do evento |
| criadoEm | Data e hora do evento |

---

## Regras de Negócio

1. O protocolo é **único** no sistema — não é possível cadastrar dois exames com o mesmo protocolo.
2. O link do paciente expira com a inativação do exame, mas o PDF permanece no FTP.
3. Ao substituir o PDF, o link do paciente permanece o mesmo (mesmo CPF e protocolo).
4. Somente o SUPER_ADMIN pode acessar auditoria, gestão de equipe e gestão de exames.
5. O usuário LAUDO acessa apenas a tela de upload.
6. O acesso do paciente é rastreado em auditoria mesmo sem login.

---

## Fluxo Principal

```
[LAUDO]
  → Faz login no sistema
  → Acessa a tela de upload
  → Preenche CPF, nome, protocolo e anexa o PDF
  → Envia o formulário
  → Sistema salva o PDF no FTP e registra no banco
  → Sistema exibe o link gerado para o paciente

[PACIENTE]
  → Recebe o link (e-mail, SMS, etc.)
  → Acessa {url}/exame?c={cpf}&p={protocolo}
  → Sistema valida CPF e protocolo
  → Paciente visualiza os dados e baixa o PDF

[SUPER_ADMIN]
  → Gerencia exames, equipe e acompanha auditoria
```
