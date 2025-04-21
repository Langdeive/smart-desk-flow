
# CHANGELOG

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
