# Prompt — estudo de marca do app de atendimento (MSR)

> Cole o texto abaixo em outro agente (Claude, ChatGPT, Gemini…) para conduzir o estudo de design.
> Ao final, traga de volta ao projeto: nome, logo em SVG + PNG 1024×1024, cor principal e secundária, e a descrição curta do app.

---

Você é um designer de marca sênior. Vou desenvolver um aplicativo de celular (iOS e Android) e uma identidade visual para ele. Conduza comigo um estudo de marca completo, em português do Brasil, em etapas, fazendo perguntas quando faltar informação e propondo opções concretas quando eu não souber responder.

## Contexto do produto

- É um app de **atendimento ao cliente por chat** (WhatsApp, Instagram, chat do site), derivado do Chatwoot (open source), com marca própria.
- Uso: eu e minha equipe atendemos clientes de **várias empresas diferentes a partir de um único app**, trocando de empresa como quem troca de conta. Hoje são três: iTelas (assistência técnica de TVs/telas), IonCert (certificação/consultoria) e aqueceBem. Podem entrar outras.
- A mesma marca também vai aparecer no **painel web** (tela de login, logo no menu) e no **widget de chat embutido nos sites** dos clientes ("Powered by …"). Portanto a marca não é a marca de um cliente; é a marca da **plataforma de atendimento** que serve todos eles.
- Empresa dona: MSR (Marcelo Roveda). Pode ou não aparecer no nome.
- Público que vê a marca: (1) os atendentes, todos os dias, no ícone do celular; (2) clientes finais, de relance, no rodapé do widget.

## O que quero que você produza

1. **Posicionamento em uma frase** e 3 atributos de personalidade (ex.: confiável, ágil, discreto).
2. **Nome**: proponha 8 a 10 opções, em 3 famílias (descritivo, evocativo, inventado). Para cada uma: pronúncia, significado, risco de confusão com marcas conhecidas, disponibilidade provável de domínio `.com.br` e de nome de usuário. Marque as 3 que você recomenda e por quê.
   - Restrições: curto (ideal até 8 letras), fácil de falar ao telefone, sem acento, funciona em português e inglês, não pode conter "Chatwoot".
3. **Logo**: para o nome escolhido, descreva 3 direções de símbolo (conceito, forma, como se comporta em 1024×1024 no ícone do celular, em 32×32 no widget, e em versão monocromática). Escolha uma e detalhe.
4. **Cores**: paleta com cor principal, secundária, neutros e cor de alerta, com códigos HEX, verificando contraste mínimo WCAG AA para texto sobre a cor principal. Considere que o app tem modo claro e escuro.
5. **Tipografia**: uma família para interface (deve existir no Google Fonts) e regras básicas de uso.
6. **Aplicações**: descreva como fica (a) o ícone do app, (b) a tela de abertura (splash), (c) a tela de login, (d) o rodapé do widget "Powered by NOME".
7. **Entregáveis finais**, em lista, exatamente neste formato para eu repassar ao desenvolvimento:
   - Nome de exibição do app
   - Descrição de uma linha (para loja e TestFlight)
   - Logo: SVG (vetor) + PNG 1024×1024 sem transparência (ícone iOS) + PNG 1024×1024 com transparência (ícone Android adaptativo, símbolo centralizado ocupando ~60%)
   - Splash: PNG 1284×2778 fundo sólido com símbolo centralizado
   - Cor principal e secundária (HEX) e cor de fundo da splash
   - Fonte escolhida
8. **Prompts de geração de imagem** para o ícone e a splash (para eu usar em um gerador de imagens), já descrevendo estilo, composição, cores e o que evitar (texto dentro do ícone, gradientes complexos, detalhes finos que somem em 32 px).

## Como conduzir

- Comece pelas perguntas que realmente mudam o resultado (no máximo 5). Depois avance etapa por etapa, esperando minha resposta em cada uma.
- Sempre que propuser opções, diga qual você escolheria e por quê.
- Não use jargão de design sem explicar em uma linha.
