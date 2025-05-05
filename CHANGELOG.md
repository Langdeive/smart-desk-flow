
# Changelog

## v1.1.4 - Agent Management Fixes (2025-05-05)

### Correções

#### Backend
- Corrigido trigger `create_company_on_signup` para usar o ID correto do usuário ao criar associação em `user_companies`.
- Melhorada segurança da Edge Function `get_user_info` com validação de autenticação adequada.
- Corrigida Edge Function `invite_agent` para verificar permissões e melhorar tratamento de erros.
- Criadas views que mapeiam as tabelas duplicadas para as canônicas.

#### Frontend
- Corrigido hook `useAuth` para evitar múltiplos refreshes de token, eliminando erros 429.
- Implementado debounce no refresh de sessão para prevenir chamadas excessivas.
- Melhorado hook `useAgents` para lidar corretamente com o companyId e evitar chamadas desnecessárias.
- Eliminado problema que causava perda de sessão na página "Agentes".
- Configurado cliente Supabase com persistência de sessão adequada.

### Instruções de verificação

#### SQL de validação
```sql
-- Verificar registros em user_companies
SELECT uc.user_id, uc.company_id, uc.role, u.email 
FROM public.user_companies uc
JOIN auth.users u ON uc.user_id = u.id
ORDER BY uc.created_at DESC;

-- Verificar views criadas
SELECT * FROM public.agents_view LIMIT 10;
SELECT * FROM public.clientes_view LIMIT 10;

-- Verificar consistência entre user_id e company_id
SELECT COUNT(*) FROM public.user_companies
WHERE user_id NOT IN (SELECT id FROM auth.users);
```

#### Passos no frontend
1. **Registro e criação de empresa**:
   - Cadastre novo usuário com nome de empresa
   - Verifique se registros são criados em `companies` e `user_companies` com o ID correto
   
2. **Verificar persistência de sessão**:
   - Faça login e navegue para diferentes páginas, especialmente "Agentes"
   - Abra DevTools > Application > Local Storage e confirme que o token permanece
   - Verifique no Network se não há chamadas repetidas a /auth/v1/token
   
3. **Teste de Edge Function**:
   - Na página "Agentes", verifique se a lista carrega corretamente
   - No DevTools > Network, confirme que `get_user_info` retorna status 200
   
4. **Teste de convite de agente**:
   - Tente adicionar um novo agente na página "Agentes"
   - Verifique se o convite é enviado e o agente aparece na lista
