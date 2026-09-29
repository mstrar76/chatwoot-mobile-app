# Pedido ao agente de design — artefatos Tendeo para o app

> Cole este texto no projeto de design "Tendeo" (Claude Design). Objetivo: entregar os arquivos
> finais que o app iOS/Android e o painel Chatwoot usam, com medidas exatas, prontos para copiar
> para o repositório sem retrabalho.

---

Preciso dos arquivos finais da marca Tendeo para o aplicativo (React Native/Expo, iOS e Android) e
para o painel web/widget do Chatwoot. Entregue **cada arquivo com o nome exato abaixo**, na pasta
`marca-tendeo/` do projeto, e confirme as medidas de cada um numa tabela ao final.

## Regras gerais
- Cor principal #4A3AC7, secundária #F4B63F, fundo claro #FAFAFD, texto #1A1830. Fonte Manrope.
- SVGs: sem `<metadata>`/manifesto embutido, sem fontes (texto em curvas), `viewBox` sem margens
  extras além das indicadas, cores em HEX.
- PNGs: exatamente nas dimensões pedidas, sRGB, 8 bits. "Sem transparência" = canal alfa ausente
  (não apenas fundo opaco). "Com transparência" = fundo realmente transparente.
- Nada de texto dentro do ícone.

## 1. App iOS
| Arquivo | Formato | Medida | Observação |
|---|---|---|---|
| `ios-icon-1024.png` | PNG sem alfa | 1024×1024 | Fundo #4A3AC7 até as bordas, sem cantos arredondados (o iOS arredonda). Símbolo branco ~58% da largura. |
| `ios-icon-dark-1024.png` | PNG com alfa | 1024×1024 | Variante para o modo escuro do iOS: símbolo #4A3AC7 claro (ou branco) sobre fundo transparente. |
| `ios-icon-tinted-1024.png` | PNG | 1024×1024 | Variante "tinted" do iOS: símbolo em tons de cinza sobre fundo preto. |

## 2. App Android
| Arquivo | Formato | Medida | Observação |
|---|---|---|---|
| `android-adaptive-foreground-1024.png` | PNG com alfa | 1024×1024 | Só o símbolo branco, **dentro da zona segura**: o símbolo inteiro cabe num círculo central de 66% do lado (≈676 px de diâmetro). |
| `android-adaptive-monochrome-1024.png` | PNG com alfa | 1024×1024 | Mesmo enquadramento, símbolo em preto, para ícones temáticos (Android 13+). |
| `android-notification-96.png` | PNG com alfa | 96×96 | Ícone da barra de notificação: símbolo branco sólido, sem fundo, traço grosso. |
| Fundo do ícone adaptativo | cor | — | Confirmar #4A3AC7. |

## 3. Abertura (splash) e telas
| Arquivo | Formato | Medida | Observação |
|---|---|---|---|
| `splash-1284x2778.png` | PNG sem alfa | 1284×2778 | Fundo #4A3AC7, símbolo branco centralizado, barra com 300 px de largura. |
| `splash-symbol-512.png` | PNG com alfa | 512×512 | Só o símbolo branco, para splash por imagem centralizada (alternativa). |
| `login-logo-144.png` | PNG com alfa | 144×144 | Ladrilho índigo com cantos arredondados (raio 32 px) e símbolo branco; aparece a 40 pt na tela de login. |
| `login-logo-288.png` / `login-logo-432.png` | PNG com alfa | 288×288 / 432×432 | Mesma arte @2x e @3x. |

## 4. Painel Chatwoot e widget dos sites (Super Admin)
| Arquivo | Formato | Uso |
|---|---|---|
| `tendeo-assinatura.svg` | SVG | `LOGO` (painel, fundo claro) |
| `tendeo-assinatura-negativa.svg` | SVG | `LOGO_DARK` (modo escuro) |
| `tendeo-simbolo.svg` | SVG | `LOGO_THUMBNAIL` (menu lateral, favicon grande) |
| `favicon-32.png`, `favicon-16.png`, `apple-touch-icon-180.png` | PNG | Favicons do painel |

## 5. Paleta para a interface do app
Entregue uma tabela de tokens para substituir o azul atual da interface:
- `primary` (botões, links, seleção) e sua versão pressionada;
- `primary-tint` (fundos de destaque, etiquetas);
- `accent` (#F4B63F: onde usar e onde não usar);
- cores de texto sobre `primary` e sobre `primary-tint`, com contraste WCAG AA comprovado;
- equivalentes para modo escuro.

## 6. Entrega
Ao final, uma tabela com: nome do arquivo, dimensão real, tem alfa (sim/não), e onde usar.
