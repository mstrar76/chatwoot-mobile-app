# HANDOVER — Tendeo (fork chatwoot-mobile-app) (2026-09-29 → próxima sessão)

## 0. TL;DR
App Tendeo (fork do app mobile do Chatwoot) instalado no iPhone do Marcelo com: vários logins
simultâneos em servidores diferentes (iTelas em `chat.omnineural.com.br`; IonCert, AqueceBem e
Prontocar em `agenteconcierge.online`), botão de troca de conta, filtro padrão "Todas" lembrado,
caixa unificada "Todas as contas" e marca Tendeo provisória. Código em `main` do fork
(`mstrar76/chatwoot-mobile-app`), 416 testes passando. Próximo: artefatos definitivos da marca
(pedido ao agente de design), paleta de cores na interface e evolução da caixa unificada.

## 1. Prompt de início
Em `START_NEXT_SESSION.md` (raiz do repo) e impresso no chat ao fim desta sessão.

## 1b. Execução recomendada
| Campo | Recomendação |
|---|---|
| Harness | Claude Code (app desktop), com acesso ao iPhone via `xcrun devicectl` |
| Modelo gestor | Opus |
| Raciocínio do gestor | `medium` para aplicar assets/paleta; `high` se mexer em sessões/multi-login ou push |
| Subagentes | Opcional: Explore (econômico) para varrer o uso de cores do tema; nada de credenciais em prompt |
| Papel do gestor | Executor na maior parte; delegar só varreduras de código volumosas |

## 2. Ordem de boot
1. `START_NEXT_SESSION.md`
2. Este handover
3. `journal/2026-09-29-multi-login-tendeo.md`
4. `branding/tendeo/README.md` e `docs/brand-assets-request.md`
5. `.env.example` (variáveis de identidade/build)

## 3. Estado atual
| Item | Valor |
|---|---|
| Repo local | `/Users/marcelo/Projetos/Chatwoot_client` (origin = fork, upstream = oficial) |
| Branch de trabalho | `main` (= `feat/multi-installation`); `develop` espelha upstream |
| Base upstream | 4.9.6 (`ffd77e3`) |
| Testes | 416 passando (`npx jest`) |
| Bundle / Firebase | `com.msr.chat` / projeto `msr-chat-260b6` (só app iOS registrado) |
| Apple | conta gratuita, team `G256VAHAYU`, certificado "Apple Development: marcelo.roveda@gmail.com" |
| iPhone | "17p Msr" UDID `00008150-001039CC3E30401C`, Modo Desenvolvedor ligado |
| Build instalado | Release com marca Tendeo + caixa unificada (commit `05ed206`), válido ~7 dias (até ~2026-10-06) |

## 4. Smoke-test
```bash
cd /Users/marcelo/Projetos/Chatwoot_client && git status -sb && npx jest 2>&1 | grep -E "^Tests:"
```
Saída esperada: `## main...origin/main` e `Tests: 416 passed, 416 total`.

## 5. Build e instalação no iPhone (gotchas)
`.env` local (não versionado) precisa de: `EXPO_PUBLIC_APP_NAME="Tendeo"`, `EXPO_PUBLIC_APP_ID=com.msr.chat`,
`EXPO_PUBLIC_APP_SCHEME=msrchat`, `EXPO_PUBLIC_DEEP_LINK_HOSTS=chat.omnineural.com.br,agenteconcierge.online`,
`EXPO_PUBLIC_IOS_GOOGLE_SERVICES_FILE=./firebase/GoogleService-Info.plist`, `EXPO_PUBLIC_IOS_PERSONAL_TEAM=true`,
`EXPO_PUBLIC_BRAND_COLOR=#4A3AC7`, `SENTRY_DISABLE_AUTO_UPLOAD=true`, `EXPO_APPLE_TEAM_ID=G256VAHAYU`.
```bash
export LANG=en_US.UTF-8 SENTRY_DISABLE_AUTO_UPLOAD=true
npx expo prebuild --platform ios --clean
cd ios && xcodebuild -workspace Tendeo.xcworkspace -scheme Tendeo -configuration Release \
  -destination 'id=00008150-001039CC3E30401C' -derivedDataPath build -allowProvisioningUpdates \
  DEVELOPMENT_TEAM=G256VAHAYU CODE_SIGN_STYLE=Automatic
xcrun devicectl device install app --device 00008150-001039CC3E30401C build/Build/Products/Release-iphoneos/Tendeo.app
```
- O nome do projeto Xcode segue `EXPO_PUBLIC_APP_NAME` (hoje `Tendeo.xcworkspace`, antes `MSRChat`).
- Mudou código JS? Não edite `src/` durante o `xcodebuild` Release: o bundle JS é gerado no build.
- iPhone bloqueado → instala, mas `process launch` falha (normal).
- `ios/` e `.env` são ignorados pelo git; `firebase/GoogleService-Info.plist` também.
- Após trocar ícones/splash: `npx expo prebuild --clean` é obrigatório.
- Assets de marca: `python3 branding/tendeo/generate.py` regenera os PNGs a partir da geometria.
- CocoaPods instalado via Homebrew; Xcode 27 + runtime iOS 27 (simulador desligado a pedido).

## 6. Decisões & regras
- Diff pequeno e isolado para facilitar merge do upstream; identidade por env, não hardcoded.
- Sessões multi-instalação: a ativa é espelhada em `auth`/`settings`; troca de servidor remonta o stack (key = sessão).
- Filtro padrão "Todas"; escolha lembrada (exceto inbox); "Limpar filtro" volta ao padrão.
- Caixa unificada consulta cada servidor com a própria credencial (não usa o `apiService` global).
- Push: Firebase próprio configurado em cada servidor via Super Admin; o app oficial deixa de receber push desses servidores quando isso for feito → configurar iTelas por último.

## 7. Loops abertos
| Pri | Tema | Próximo passo | Dono |
|-----|------|---------------|------|
| 1 | Validar caixa unificada e filtro no iPhone | Testar "Todas as contas", abrir conversa de outra conta, voltar | Usuário |
| 1 | Artefatos definitivos da marca | Colar `docs/brand-assets-request.md` no agente de design; trazer os arquivos | Usuário |
| 2 | Aplicar artefatos + paleta Tendeo na interface | Substituir PNGs, ícones iOS dark/tinted, Android monochrome, tokens de cor (tema tailwind), fonte Manrope (avaliar) | Agente |
| 2 | Caixa unificada v2 | Escolher quais contas entram (checkbox em Settings), contagem de não lidas por conta, tempo real opcional | Agente |
| 3 | Push | Pagar Apple Developer; APNs key no Firebase; FIREBASE_PROJECT_ID/CREDENTIALS em cada servidor; build sem `IOS_PERSONAL_TEAM` | Usuário → Agente |
| 3 | Tocar na notificação abre o servidor certo | Resolver servidor pela conta/`notification id` quando houver ambiguidade | Agente |
| 3 | Android | Registrar app Android no Firebase, `google-services.json`, SDK Android, APK | Usuário/Agente |
| 4 | Textos "Chatwoot" restantes na UI (URL de instalação, erros) | Revisar i18n pt_BR/en | Agente |
| 4 | Branding do painel/widget nos servidores | Em sessão própria (repo `deployment`) | Outra sessão |

## 8. Loops fechados
Fork e remotes; multi-login; troca rápida; filtro lembrado; build/launch Xcode 27; build conta gratuita;
Firebase iOS; marca provisória; caixa unificada v1; deploy no iPhone.

## 9. Glossário
- **Tendeo**: marca do app (antes "MSR Chat"); design no Claude Design, projeto `252e05e8-ee47-44bf-a85a-9f959f23af8c`.
- **Instalação/servidor**: um Chatwoot (domínio). **Conta**: account dentro de uma instalação.
- iTelas → `chat.omnineural.com.br`; IonCert, AqueceBem, Prontocar → `agenteconcierge.online`.
- "Cast Bem"/"Aquece Bem" em transcrição de voz = **AqueceBem**.

## 10. Armadilhas desta sessão
- iOS 27 mata apps sem UIScene: exige `enableSceneSupport` (Expo ≥ 57.0.23).
- Patch `expo-modules-jsi@57.0.3` ficou obsoleto com Expo 57.0.25 (removido).
- Conta Apple gratuita não assina push nem associated domains → `with-ios-personal-team.js`.
- Console do Firebase trava o Chrome da extensão com frequência; abrir aba nova resolve.
- Colar senha no simulador: `pbpaste | xcrun simctl pbcopy booted`.

## 11. Guardrails
- Não commitar `.env`, `firebase/GoogleService-Info.plist`, `ios/`.
- Não digitar senhas pelo usuário; login é dele.
- Não subir simulador/Metro sem pedido (preferência: deploy direto no iPhone). Parar o que subir.
- Não alterar `develop` (espelho do upstream).

## 12. Mapa de artefatos
Ver journal da sessão (§ Arquivos principais) e `branding/tendeo/`, `docs/brand-*.md`.

## 13. Dependências do usuário
Artefatos do agente de design; validação no iPhone; decisão sobre pagar Apple Developer (push/TestFlight).

## 14. Commits
Branch `feat/multi-installation` → `main` (fork): `683e547` multi-login · `97ebe6f` identidade por env ·
`c5d8eb2` prompt de marca · `edbf927` Xcode 27 · `9f3ba72` equipe pessoal · `21f33a9` troca rápida ·
`0dea7ee` filtro · `eef468a` marca Tendeo · `05ed206` caixa unificada · + commit de handover.

---
*Atualizado em 2026-09-29 por Claude (Opus).*
