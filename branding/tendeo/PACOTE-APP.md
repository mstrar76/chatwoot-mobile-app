# Tendeo — pacote de arquivos para o app e o painel

Gerado em 2026-09-29 por `python3 gerar_pacote_app.py` (PNGs e símbolos) e `python3 gerar_assinatura.py` (assinaturas).
Todos os PNGs: sRGB (perfil embutido), 8 bits por canal. Medidas abaixo foram lidas dos arquivos depois de gerados.

## Arquivos

| Arquivo | Dimensão real | Alfa | Onde usar |
|---|---|---|---|
| `ios-icon-1024.png` | 1024×1024 | não | Ícone do app iOS (`ios.icon` / `icon`). Fundo em degradê vertical até as bordas (#7B6BF2 no alto, #4A3AC7 no meio, #2A1E88 na base), símbolo branco com 58% da largura. |
| `ios-icon-dark-1024.png` | 1024×1024 | sim | Variante de modo escuro do iOS 18+. Símbolo #9D94FA, fundo transparente. |
| `ios-icon-tinted-1024.png` | 1024×1024 | não | Variante "tinted" do iOS 18+. Símbolo branco sobre preto. |
| `android-adaptive-foreground-1024.png` | 1024×1024 | sim | `android.adaptiveIcon.foregroundImage`. Símbolo branco; cabe num círculo de 623 px (60,9% do lado). |
| `android-adaptive-monochrome-1024.png` | 1024×1024 | sim | `android.adaptiveIcon.monochromeImage` (ícones temáticos, Android 13+). Mesmo enquadramento, símbolo preto. |
| `android-notification-96.png` | 96×96 | sim | Ícone da barra de notificação (`expo-notifications` → `icon`). Símbolo branco, 84 px de largura. |
| `splash-1284x2778.png` | 1284×2778 | não | Splash em tela cheia. Fundo #4A3AC7, barra do símbolo com 300 px. |
| `splash-symbol-512.png` | 512×512 | sim | Splash por imagem centralizada (`expo-splash-screen` → `image`), com `backgroundColor` #4A3AC7. Cabe num círculo de 312 px (61%). |
| `login-logo-144.png` | 144×144 | sim | Logo da tela de login @1x. Ladrilho índigo, raio 32 px. |
| `login-logo-288.png` | 288×288 | sim | Idem @2x (raio 64 px). |
| `login-logo-432.png` | 432×432 | sim | Idem @3x (raio 96 px). |
| `tendeo-assinatura.svg` | 1197,82×256 | vetor | Chatwoot Super Admin → `LOGO` (fundo claro). |
| `tendeo-assinatura-negativa.svg` | 1197,82×256 | vetor | Chatwoot Super Admin → `LOGO_DARK`. |
| `tendeo-simbolo.svg` | 1024×1024 | vetor | Chatwoot Super Admin → `LOGO_THUMBNAIL`. Ladrilho índigo com símbolo branco. |
| `favicon-32.png` | 32×32 | sim | Favicon do painel. |
| `favicon-16.png` | 16×16 | sim | Favicon do painel. |
| `apple-touch-icon-180.png` | 180×180 | não | Ícone de atalho do painel no iOS. |

Arquivos extras, fora da lista pedida: `tendeo-icone.svg` (ícone quadrado cheio), `tendeo-simbolo-indigo.svg` e `tendeo-simbolo-branco.svg` (símbolo sem fundo), `tendeo-assinatura-mono-preta.svg` e `tendeo-assinatura-mono-branca.svg`. Versões antigas estão em `_anteriores/`.

Cor de fundo do ícone adaptativo do Android: **#4A3AC7** (confirmado).

## Degradê: só no ícone do app iOS

Decisão de Marcelo em 2026-09-29. O `ios-icon-1024.png` é o único arquivo com degradê; Android, splash, login, favicons e painel continuam chapados em #4A3AC7.

- Paradas: `#7B6BF2` (alto) → `#4A3AC7` (meio) → `#2A1E88` (base).
- Contraste do símbolo branco com o fundo atrás dele: de 5,6:1 no topo da barra a 9,8:1 na base da haste.
- As variantes escura e "tinted" do iOS não têm degradê: o sistema aplica o próprio fundo.
- Para o efeito de vidro do iOS 26 (Liquid Glass) é preciso montar um arquivo `.icon` no Icon Composer (macOS) com as camadas de `variantes-profundidade/` e apontá-lo em `ios.icon` (Expo SDK 54+). Não foi feito.
- Versões anteriores do ícone (chapado e degradê suave) estão em `_anteriores/`.

## Decisões de enquadramento

- **Zona segura do Android.** O pedido citava um círculo de 66% do lado (≈676 px). A regra do Android é 66 dp num quadro de 108 dp, ou seja, 61,1% (≈626 px). O símbolo foi enquadrado no círculo menor, de 623 px, que atende às duas medidas.
- **`tendeo-simbolo.svg` é o ladrilho, não o símbolo solto.** O símbolo índigo sem fundo tem contraste de 2,4:1 sobre o fundo escuro do painel e sumiria no modo escuro; o ladrilho funciona nos dois modos. O símbolo solto segue disponível como `tendeo-simbolo-indigo.svg`.
- **Ícone escuro do iOS em #9D94FA.** O #4A3AC7 tem contraste de 2,7:1 sobre preto; o #9D94FA tem 8,1:1.
- **Favicons com símbolo um pouco maior** (62% em 32 px, 66% em 16 px) para continuar legível.

## Tokens de cor da interface

Substituem o azul atual do app. Versão para código em `tendeo-tokens.json`.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `primary` | `#4A3AC7` | `#6656E0` | Fundo de botão principal, seleção, interruptor ligado |
| `primary-pressed` | `#3629A0` | `#4A3AC7` | Botão principal pressionado |
| `primary-text` | `#4A3AC7` | `#9D94FA` | Links, ícones ativos, texto de destaque sobre o fundo da tela |
| `primary-tint` | `#ECEAFB` | `#27234F` | Fundo de destaque, etiquetas, item selecionado na lista |
| `on-primary` | `#FFFFFF` | `#FFFFFF` | Texto e ícone sobre `primary` |
| `on-primary-tint` | `#3629A0` | `#C9C4FF` | Texto e ícone sobre `primary-tint` |
| `accent` | `#F4B63F` | `#F4B63F` | Contador de não lidas, marcador de prioridade |
| `on-accent` | `#1A1830` | `#1A1830` | Texto sobre `accent` |

### Contraste (WCAG AA exige 4,5:1 para texto)

| Par | Claro | Escuro |
|---|---|---|
| `on-primary` sobre `primary` | 7,72:1 | 5,29:1 |
| `on-primary` sobre `primary-pressed` | 10,60:1 | 7,72:1 |
| `on-primary-tint` sobre `primary-tint` | 8,95:1 | 8,91:1 |
| `primary-text` sobre o fundo da tela | 7,41:1 | 7,18:1 |
| `primary-text` sobre `primary-tint` | 6,52:1 | 5,59:1 |
| `on-accent` sobre `accent` | 9,54:1 | 9,54:1 |
| Botão `primary` contra o fundo da tela (mínimo 3:1 para componentes) | 7,41:1 | 3,54:1 |

No modo escuro o botão usa `#6656E0` porque o `#4A3AC7` tem só 2,43:1 contra o fundo `#121020` e o botão perderia o contorno.

### Accent (#F4B63F): onde usar e onde não usar

Usar: contador de mensagens não lidas, marcador de conversa prioritária, destaque pontual. Sempre com texto `#1A1830`.

Não usar: como cor de texto ou de link sobre fundo claro (1,74:1); com texto branco por cima (1,81:1); como fundo de botão principal; em áreas grandes; para erro ou aviso de falha (isso é `danger`).
