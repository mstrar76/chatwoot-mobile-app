# Tendeo — entregáveis de marca

Estudo concluído em 2026-09-29. Pranchas completas no Claude Design:
https://claude.ai/design/p/252e05e8-ee47-44bf-a85a-9f959f23af8c

## Lista para o desenvolvimento

- **Nome de exibição do app:** Tendeo
- **Descrição de uma linha (loja e TestFlight):** Atenda os clientes de todas as suas empresas em um só app.
- **Logo:**
  - SVG (vetor): `tendeo-icone.svg` (ícone quadrado cheio), `tendeo-simbolo.svg` (ladrilho índigo de cantos arredondados com símbolo branco), `tendeo-simbolo-indigo.svg` e `tendeo-simbolo-branco.svg` (símbolo sem fundo)
  - SVG da assinatura horizontal (símbolo + nome, texto em curvas): `tendeo-assinatura.svg` (fundos claros), `tendeo-assinatura-negativa.svg` (fundos escuros), `tendeo-assinatura-mono-preta.svg`, `tendeo-assinatura-mono-branca.svg`
  - PNG 1024×1024 sem transparência (ícone iOS): `ios-icon-1024.png` — único arquivo com fundo em degradê (#7B6BF2 → #4A3AC7 → #2A1E88)
  - PNG 1024×1024 com transparência (ícone Android adaptativo): `android-adaptive-foreground-1024.png` — símbolo branco dentro da zona segura; cor de fundo do ícone adaptativo: `#4A3AC7`
- **Splash:** PNG 1284×2778 fundo sólido com símbolo centralizado: `splash-1284x2778.png`
- **Pacote completo para o app e o painel** (todos os tamanhos, favicons e tokens de cor): ver `PACOTE-APP.md` e `tendeo-tokens.json`
- **Cor principal:** `#4A3AC7` · **Cor secundária:** `#F4B63F` · **Cor de fundo da splash:** `#4A3AC7`
- **Fonte escolhida:** Manrope (Google Fonts), pesos 500, 700 e 800

## Referência complementar

| Item | Valor |
|---|---|
| Posicionamento | Um só lugar para a equipe atender bem, e rápido, os clientes de todas as empresas que ela cuida. |
| Personalidade | Confiável, ágil, discreto |
| Marca-mãe | OmniNeural (assinatura "Tendeo · by OmniNeural" só na tela de login) |
| Índigo profundo (pressionado) | `#3629A0` |
| Índigo claro (modo escuro) | `#9D94FA` |
| Alerta | `#D42A46` (modo escuro `#FF7A8C`) |
| Sucesso | `#1B7F5A` (modo escuro `#5FD3A6`) |
| Modo claro: fundo / superfície / linha / texto secundário / texto | `#FAFAFD` / `#FFFFFF` / `#E4E2EF` / `#5B5875` / `#1A1830` |
| Modo escuro: fundo / superfície / linha / texto secundário / texto | `#121020` / `#1C1A2E` / `#2E2B45` / `#A9A6C2` / `#F2F1FA` |
| Rodapé do widget | "Powered by Tendeo", texto 12 px, símbolo 16 px |

Contraste: texto branco sobre `#4A3AC7` = 7,72:1 (WCAG AA exige 4,5:1). Sobre o âmbar `#F4B63F` usar sempre texto `#1A1830` (9,54:1); branco sobre âmbar não passa (1,81:1).

## Medidas do símbolo (quadro de 1024)

| Peça | x | y | largura | altura | raio |
|---|---|---|---|---|---|
| Barra | 215 | 266 | 594 | 154 | 77 |
| Haste | 435 | 492 | 154 | 266 | 77 |

Respiro entre barra e haste: 72. Os arquivos são regeneráveis com `python3 gerar_pacote_app.py`.

## Assinatura horizontal

- Proporção 4,68 : 1 (1197,82 × 256). Ícone com lado 256; nome em Manrope 800 com corpo igual ao lado do ícone.
- Distância entre ícone e nome: 32% do lado do ícone. Letras 4% mais juntas, com o ajuste de pares (kerning) da própria fonte.
- Altura das maiúsculas centralizada no ícone.
- Área de respiro ao redor: no mínimo metade do lado do ícone. Os arquivos não incluem margem.
- O texto está em curvas: os arquivos não dependem da fonte instalada.
- Regeneráveis com `python3 gerar_assinatura.py` (requer fonttools). Fonte e licença (SIL Open Font License) em `fonte/`.

## Prompts de geração de imagem

Os arquivos acima já estão prontos e com medidas exatas; os prompts servem para gerar variações ou material de divulgação.

### Ícone

> Ícone de aplicativo, quadrado 1024×1024, fundo sólido índigo #4A3AC7 preenchendo todo o quadro, sem cantos arredondados e sem transparência. No centro, um símbolo branco #FFFFFF formado por duas formas de pílula com pontas totalmente redondas: uma barra horizontal larga em cima e uma haste vertical curta embaixo, centralizada sob a barra, com um pequeno espaço vazio entre as duas, formando um "T" abstrato. As duas peças têm a mesma espessura. O símbolo ocupa cerca de 58% da largura do quadro. Estilo plano (flat), vetorial, geométrico, minimalista, bordas nítidas. Evitar: qualquer texto ou letra de fonte, degradês, sombras, brilho, efeito 3D, contornos, texturas, balões de conversa, detalhes finos, mais de duas cores.

### Splash

> Tela de abertura de aplicativo em formato vertical 1284×2778, fundo sólido índigo #4A3AC7 sem variação. Exatamente no centro, um símbolo branco #FFFFFF pequeno, formado por duas formas de pílula com pontas redondas: uma barra horizontal em cima e uma haste vertical curta embaixo, com um pequeno espaço entre elas, formando um "T" abstrato. A barra tem cerca de 23% da largura da tela. Todo o restante da tela fica vazio. Estilo plano, vetorial, minimalista. Evitar: texto, nome do app, slogan, degradês, sombras, brilho, padrões de fundo, ilustrações, moldura de celular, elementos decorativos.

## Pendências antes de publicar

- Busca de marca "Tendeo" no INPI (não realizada).
- Conferir nomes de usuário nas redes (não verificados).
- Existe uma empresa Tendeo na Argentina (loja virtual, tendeo.ar) e tendeo.bid na Alemanha; `tendeo.com` está à venda.

Resolvido: domínio `tendeo.com.br` registrado (informado por Marcelo em 2026-09-29); assinatura horizontal gerada em SVG.
