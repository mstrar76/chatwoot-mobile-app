Estou retomando o projeto **Tendeo** (fork do app mobile do Chatwoot, `/Users/marcelo/Projetos/Chatwoot_client`) em sessão de follow-up.

**Execução recomendada:** harness Claude Code (app desktop); gestor Opus com raciocínio medium (high se mexer em sessões/push); subagentes opcionais (Explore econômico só para varrer uso de cores); gestor executa, delega apenas varreduras volumosas.

Faça o boot lendo, nesta ordem:
1. `journal/2026-09-29-handover-proxima-sessao.md` (handover detalhado)
2. `journal/2026-09-29-multi-login-tendeo.md`
3. `branding/tendeo/README.md` e `docs/brand-assets-request.md`
4. `.env.example`

**Contexto rápido:** app Tendeo instalado no meu iPhone ("17p Msr") com vários logins simultâneos (iTelas em chat.omnineural.com.br; IonCert/AqueceBem/Prontocar em agenteconcierge.online), troca rápida de conta, filtro padrão "Todas" lembrado e caixa unificada "Todas as contas". Branch `main` do fork mstrar76/chatwoot-mobile-app; conta Apple gratuita (sem push, build vale 7 dias).

**Verificar:** `git status -sb && npx jest 2>&1 | grep -E "^Tests:"` → `main...origin/main` e `416 passed`.
Build/instalação no iPhone: comandos no handover §5 (workspace `ios/Tendeo.xcworkspace`, `.env` local obrigatório, não usar simulador).

**Regras de trabalho:** diff pequeno para facilitar merge do upstream; identidade por env; nunca commitar `.env`/plist/`ios/`; login e senhas são meus.

**Tarefas candidatas desta sessão:**
1. Aplicar os artefatos definitivos da marca que o agente de design entregar (ícones iOS/Android incl. dark/tinted/monochrome, splash, logo) e a paleta Tendeo (#4A3AC7 / #F4B63F) na interface.
2. Caixa unificada v2: escolher quais contas entram, não lidas por conta; corrigir o que eu reportar do teste no iPhone.
3. Preparar push (quando a conta Apple for paga) e/ou o Android.

Comece confirmando o estado atual e o que ataco primeiro.
