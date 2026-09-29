# 2026-09-26 → 2026-09-29 — Fork Tendeo: multi-login, Xcode 27, marca e caixa unificada

## Ações realizadas
| # | Ação | Status |
|---|------|--------|
| 1 | Fork `chatwoot/chatwoot-mobile-app` → `mstrar76/chatwoot-mobile-app`; clone local, `upstream` = oficial | ✅ |
| 2 | Vários logins ativos em servidores diferentes (sessões por instalação) + troca de conta | ✅ testado no simulador e iPhone |
| 3 | Identidade do app por variáveis de ambiente (nome, bundle, scheme, domínios, cor) | ✅ |
| 4 | Projeto Firebase `msr-chat-260b6`, app iOS `com.msr.chat` registrado, plist baixado (fora do git) | ✅ (Android pendente) |
| 5 | Xcode 27: patch `react-native-ios-context-menu`, Expo 57.0.25 + `enableSceneSupport` | ✅ |
| 6 | Opção de build "equipe pessoal" (conta Apple gratuita) sem push/associated domains | ✅ |
| 7 | Botão de troca de conta no topo de Conversations (sheet compartilhado com Settings) | ✅ |
| 8 | Filtro de conversas: padrão "Todas" e escolha lembrada entre contas/servidores | ✅ |
| 9 | Marca Tendeo: ícone, adaptive icon, splash, logo do login (gerados por script) | ✅ provisório |
| 10 | Caixa unificada "Todas as contas" (polling 30 s, abre conversa na conta certa) | ✅ instalado, aguardando validação do usuário |
| 11 | Deploy Release direto no iPhone "17p Msr" via xcodebuild + devicectl | ✅ |
| 12 | Sessão paralela aberta para branding do painel/widget Chatwoot (repo `deployment`) | ↗ outra sessão |

## Arquivos principais
- `src/store/sessions/*` (slice, root reducer, selectors, specs), `src/utils/sessionUtils.ts`
- `src/components-next/sheet-components/{SwitchAccount,AccountSwitcherSheet}.tsx`
- `src/screens/conversations/components/unified/UnifiedConversationList.tsx`, `src/services/unifiedConversations.ts`, `src/hooks/useUnifiedConversations.ts`
- `src/store/conversation/conversationFilterSlice.ts`, `src/services/APIService.ts`, `src/navigation/tabs/AppTabs.tsx`
- `app.config.ts`, `with-ios-personal-team.js`, `patches/react-native-ios-context-menu@3.2.1.patch`, `package.json`
- `branding/tendeo/{generate.py,README.md}`, `assets/*.png`, `src/assets/images/logo.png`
- `docs/brand-design-prompt.md`, `docs/brand-assets-request.md`

## Decisões
- Uma única versão do app (Tendeo) com vários servidores; iOS via TestFlight (futuro), Android via APK.
- Push exige Firebase próprio configurado em cada servidor (Super Admin), sem mudar código do servidor.
- `develop` espelha o upstream; `main` do fork = versão Tendeo.
- Filtro padrão "Todas" (antes "Minhas" escondia conversas de outros agentes).
- Deploy direto no iPhone; simulador não é usado (poupar recursos).

## Loops abertos
Ver `journal/2026-09-29-handover-proxima-sessao.md` §7.

## Loops fechados
Multi-login; troca rápida; filtro lembrado; build Xcode 27; primeira versão da marca; caixa unificada v1.
