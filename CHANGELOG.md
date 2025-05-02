
# CHANGELOG

## [1.1.4] - 2025-05-02

### Bug Fixes

1. **Agent Management**
   - Fixed the invite_agent edge function to use service role to bypass RLS
   - Added company existence check to prevent foreign key constraint errors
   - Resolved "User not allowed" errors during agent invitation
   - Enhanced error handling and response format
   - Improved success response with more detailed data

## [1.1.3] - 2025-04-24

### Bug Fixes

1. **Agent Management**
   - Fixed issue with company ID not being properly passed to the agent invitation function
   - Improved error handling with more descriptive toast messages 
   - Better logging for troubleshooting agent management issues
   - Added clear error messages when company ID is missing

## [1.1.2] - 2025-04-24

### Bug Fixes

1. **Agent Management**
   - Fixed TypeScript errors in the useAgents hook
   - Changed RPC function calls to Edge Function calls for better type safety
   - Added proper type annotations for user data
   - Implemented Edge Functions for user info retrieval and agent invitation
   - Improved error handling and logging

## [1.1.1] - 2025-04-24

### Bug Fixes

1. **Agent Management**
   - Fixed agent list not displaying properly
   - Fixed invite agent functionality
   - Improved error handling with meaningful toast messages
   - Updated authentication flow to use correct company_id from app_metadata

## [1.1.0] - 2025-04-21

### Implementação de Gerenciamento de Clientes e Contatos

1. **Modelo de Dados**
   - Adicionado suporte para múltiplos contatos por cliente
   - Implementada vinculação de tickets a contatos específicos
   - Atualizado sistema de validação com zod schemas

2. **Gerenciamento de Clientes**
   - Nova interface de listagem de clientes com filtragem
   - Formulário para criação/edição de clientes
   - Funcionalidade para ativar/desativar clientes

3. **Gerenciamento de Contatos**
   - Interface para adicionar múltiplos contatos por cliente
   - Suporte para designação de contato primário
   - Validação de e-mail e telefone com regras personalizadas

4. **Integração com Tickets**
   - Atualização do fluxo de criação de tickets para selecionar cliente e contato
   - Exibição de informações de cliente e contato nos detalhes do ticket
   - Atualização da visualização de histórico de tickets

5. **Melhorias Técnicas**
   - Implementação de atualizações otimistas com TanStack Query
   - Correções de tipagem TypeScript para maior segurança
   - Controle de acesso baseado em empresa (RLS)

### Planejamento Futuro
- Importação CSV de clientes e contatos
- Dashboard com métricas por cliente
- Relatórios de SLA por cliente

## [1.0.0] - 2025-04-21

### Melhorias de Navegação e Usabilidade

1. **Header / Navegação Global**
   - Substituído botões Login e Cadastrar por AvatarMenu quando usuário está logado
   - Adicionado dropdown "Cadastros" com links para Clientes e Agentes
   - Implementado highlight para item ativo com classe text-primary font-medium

2. **Botão de Ação Rápida**
   - Adicionado botão global "Novo Ticket" no header, visível em todas as páginas autenticadas
   - Modal de criação de ticket integrado ao clicar no botão

3. **Cards de KPI (Dashboard)**
   - Transformados KpiCards em links para páginas relacionadas:
     - Total de Tickets → /tickets
     - Taxa de Resolução → /tickets?status=resolved
     - Tempo Médio de Resposta → /tickets?sort=firstResponseTime
     - Resolvidos por IA → /tickets?ai_handled=true
   - Adicionados atributos title/aria-label para acessibilidade

4. **Sidebar Collapsible**
   - Implementada navegação lateral alternativa à navbar
   - Organização por categorias:
     - Suporte (Dashboard, Tickets)
     - Cadastros (Clientes, Agentes)
     - Base de Conhecimento (Artigos)
     - Configurações (Geral)
   - Toggle para exibir/ocultar em dispositivos móveis

5. **Theme Toggle**
   - Adicionado botão para alternar entre tema claro/escuro
   - Ícones Sol/Lua para indicar tema atual
   - Implementado com hook useTheme para persistência da preferência

6. **Condições de Exibição**
   - Implementada lógica para mostrar apenas Login/Cadastro quando usuário não está autenticado
   - Exibição condicional dos elementos de navegação baseada no estado de autenticação

### Bug Fixes
- Corrigido fluxo de listagem e convite de agentes
  - Ajustada query para buscar dados corretos da tabela user_companies
  - Implementado tratamento adequado de erros com feedback visual
  - Adicionado estado de carregamento na listagem
  - Modal permanece aberto em caso de erro no convite
  - Atualização automática da lista após convite bem-sucedido

