# 💊 FarmaViva — IA Commerce para Farmácias

> **Protótipo desenvolvido para o desafio de IA Commerce da Pague Menos.**
> Uma experiência de compra guiada por intenção — **não é mais um chatbot**.

O cliente diz (ou fotografa) o que precisa; a plataforma devolve uma **cesta pronta, explicada e segura**, dentro do orçamento, e leva até o checkout — sem sair da jornada de compra.

---

## 📑 Sumário

- [O desafio e a ideia](#-o-desafio-e-a-ideia)
- [Principais funcionalidades](#-principais-funcionalidades)
- [Jornada do usuário](#-jornada-do-usuário)
- [Como o motor de IA funciona](#-como-o-motor-de-ia-funciona)
- [Camada de segurança sanitária](#-camada-de-segurança-sanitária)
- [Arquitetura e estrutura de pastas](#-arquitetura-e-estrutura-de-pastas)
- [Stack](#-stack)
- [Como executar](#-como-executar)
- [Design e identidade visual](#-design-e-identidade-visual)
- [O que é real e o que é simulado](#-o-que-é-real-e-o-que-é-simulado)
- [Roadmap](#-roadmap)

---

## 🎯 O desafio e a ideia

Consumidores já usam ChatGPT e Gemini para tirar dúvidas de saúde, bem-estar e cuidados. Mas chatbots dentro de e-commerce costumam ser lentos, genéricos e cheios de atrito: o cliente digita, espera, lê um texto longo e ainda precisa procurar os produtos sozinho.

O desafio pedia **repensar o comércio para uma jornada que começa com um prompt e termina em compra**, com uma experiência simples, personalizada, segura e integrada — e deixava claro que **não era para construir mais um chatbot**.

### A solução

Em vez de uma janela de conversa, o protótipo oferece uma **Compra Guiada por IA nativa**:

- fica **ao lado da busca tradicional**, que continua funcionando normalmente;
- aceita **intenção em linguagem natural**, **atalhos de 1 toque**, **foto de medicamento** e **receita médica**;
- responde com **cartões de produtos** (cesta montada), não com parágrafos;
- explica o **raciocínio farmacêutico** por trás de cada escolha;
- permite **ajustar orçamento, trocar por genéricos e remover itens** sem recomeçar a busca;
- passa pelo **mesmo carrinho e checkout** da loja, com travas sanitárias.

> A loja não precisa ensinar o cliente a usar IA nem substituir a busca que já funciona. Ela entrega ajuda consultiva exatamente quando o cliente tem uma necessidade, mas não sabe quais produtos combinar.

---

## ✨ Principais funcionalidades

### 1. Três jornadas de entrada com 1 clique
Definidas em [`src/data/intentPresets.js`](src/data/intentPresets.js):

| Jornada | O que faz | Exemplos de atalho |
| :-- | :-- | :-- |
| **Montar um kit** | Soluções completas para uma situação de rotina | Proteção solar & toque seco · Primeiros socorros · Nutrição infantil |
| **Comprar dentro do meu orçamento** | Equilibra os melhores produtos sem ultrapassar um teto | Cesta até R$ 50 · Dermo até R$ 80 · Família até R$ 100 |
| **Repetir minha compra** | Recompra inteligente, otimizando hábitos com genéricos | Repetir última cesta com genéricos · Reposição mensal de higiene |

### 2. Linguagem natural, sem formulário
O usuário escreve livremente, por exemplo:

- *"kit de praia gastando até 90 reais"*
- *"estou gripado, quero algo mais barato"*
- *"preciso de um kit de primeiros socorros para viagem"*

O motor identifica **tema**, **teto de gastos** e **preferência por genéricos** a partir do texto.

### 3. Compra por foto e por receita
Pela câmera (webcam real via `getUserMedia`) ou por upload de galeria/PDF, o usuário escolhe a intenção:

- 🔍 **Encontrar genérico equivalente** — mostra o medicamento de referência, o genérico, o preço e a **economia em %**;
- 🔁 **Recomprar** o mesmo medicamento;
- 📄 **Enviar receita** — libera a dispensação dos itens prescritos.

### 4. Cesta ajustável em tempo real
- **Slider/teto de orçamento** que reequilibra a cesta na hora;
- **Toggle de genéricos** (marca de referência ⇄ genérico);
- **Troca individual** de produto por substituto e **remoção** de itens;
- **Chat de refinamento** ("tirar vitamina", "sem protetor", "até 60 reais") que reaplica o motor sobre a cesta atual.

### 5. Raciocínio transparente
Cada cesta vem com um **título de jornada** e uma **justificativa farmacêutica** (ex.: por que protetor de toque seco + hidratante pós-sol), mais os **papéis clínicos** dos produtos — o cliente entende *por que* aquilo foi recomendado.

### 6. Carrinho compartilhado e checkout completo
- Itens vindos da busca tradicional e da IA convivem na mesma sacola (itens da IA recebem selo **✨ Sugerido por IA**);
- adicionar a **cesta inteira** com um clique ou itens avulsos;
- barra de **frete grátis** e economia total versus preço original;
- checkout com **Entrega Turbo** ou **Clique & Retire**, **Pix**/cartão e confirmação com número de pedido.

### 7. Duas interfaces no mesmo projeto
Um seletor flutuante alterna entre:

- 📱 **App Mobile (iPhone)** — moldura de iPhone 393×852 com Dynamic Island, barra de status, bottom navigation, bolhas de ajuda no FAB e telas dedicadas;
- 💻 **Site Desktop (Web)** — header completo, home, página de resposta da IA, rodapé e modais de navegação.

### 8. Conta e área do cliente
Login/cadastro (telas separadas para mobile e desktop) e **área do usuário** com abas: **Histórico de compras**, **Meus dados**, **Endereços**, **Cartões & carteira**, **Receitas médicas** e **Alertas de remédios**.

### 9. Recursos de navegação do site
Modais de **Lojas**, **Baixar o app**, **Ajuda** e **Localização por CEP**.

---

## 🧭 Jornada do usuário

```
Intenção (texto · atalho · foto · receita)
        │
        ▼
Motor de IA interpreta tema, orçamento e preferências
        │
        ▼
Cesta explicada (raciocínio + selos de segurança)
        │            ▲
        ▼            │ ajustes sem recomeçar:
Refinamento ─────────┘ orçamento · genéricos · trocar · remover · chat
        │
        ▼
Carrinho compartilhado (busca tradicional + IA)
        │
        ▼
Checkout com travas sanitárias → Pedido confirmado
```

---

## 🧠 Como o motor de IA funciona

Arquivo: [`src/services/aiCommerceEngine.js`](src/services/aiCommerceEngine.js)

A função `runAiCommerceEngine(params)` é **determinística e baseada em regras**: converte intenção em uma seleção estruturada do catálogo. Ela é pura e retorna sempre o mesmo objeto de resultado, o que facilita testar e, depois, trocar por um LLM real.

### Entrada

| Parâmetro | Descrição |
| :-- | :-- |
| `prompt` | Texto livre do usuário |
| `budget` | Teto de gastos (opcional; também é extraído do texto) |
| `preferGenerics` | Preferir genéricos |
| `customSelectedIds` | Lista de produtos já escolhida (presets / ajustes do usuário) |
| `attachment` | Foto, imagem ou documento, com `intent` (`generic`, `repurchase`, `prescription`, `situation`) |

### Pipeline

1. **Análise de anexo** — identifica o medicamento fotografado (ex.: Dorflex, Rivotril, Neosaldina) e monta a comparação referência × genérico, com preço, economia e registro ANVISA; ou valida uma receita.
2. **Extração de orçamento** — regex para expressões como *"até 80"*, *"R$ 100"*, *"gastar 60"*, *"teto de 70"*.
3. **Preferência por genéricos** — detecta *"genérico"*, *"mais barato"*, *"econom…"* (ou o oposto: *"de marca"*, *"original"*).
4. **Classificação de tema** — `controlled_rx`, `praia`, `skincare`, `viagem`, `gripe`, `recompra`, `baby`, `economia` ou busca por nome/tag/marca, com *fallback* para um kit essencial.
5. **Remoções por texto** — "tirar vitamina", "sem protetor", "remover curativo"…
6. **Substituição por genéricos** — via `genericEquivalentId` do catálogo.
7. **Ajuste ao orçamento** — se estourar o teto, troca por genéricos; se ainda estourar, remove itens menos prioritários até caber.
8. **Raciocínio e título** — texto de justificativa por tema.
9. **Segurança sanitária** — monta o objeto `safetyNotice` (veja abaixo).
10. **Refinamentos rápidos** — ações sugeridas (trocar por genéricos, ajustar teto, remover o item mais caro).

### Saída

```js
{
  theme, journeyTitle, rationale, appliedPrompt,
  preferGenerics, targetBudget, isWithinBudget,
  totalPrice, originalTotal, regularTotal, savingsTotal,
  recommendedItems,      // produtos do catálogo
  safetyNotice,          // exigência de receita, avisos, compliance
  quickRefinements,      // ações de ajuste rápido
  attachedAnalysis       // detalhes da foto / receita analisada
}
```

### Modelo de produto (`src/data/catalog.js`)

Cada item traz `price`, `originalPrice`, `clubPrice` (preço do clube), `category`, `tags`, `rating`, `requiresPrescription`, `isControlled`, `isGeneric`, `genericEquivalentId` e **`clinicalRole`** (a função do produto na cesta, usada para explicar a recomendação).

---

## 🛡️ Camada de segurança sanitária

Em saúde, recomendar automaticamente exige cuidado. O projeto trata isso como parte central do produto, não como rodapé:

- **Detecção de controlados e prescritos** (benzodiazepínicos, antibióticos, isotretinoína, semaglutida etc.) por consulta, tema e flags do catálogo;
- **Nenhum medicamento controlado é liberado sem receita** — o motor devolve `requiresPrescriptionValidation` e a interface bloqueia a compra até haver validação;
- **Validação de receita** (foto ou PDF) que destrava a dispensação dos itens prescritos;
- **Avisos obrigatórios**: consulta médica, riscos da automedicação, texto *"se persistirem os sintomas, o médico deverá ser consultado"*;
- **Supervisão farmacêutica** destacada (CRF);
- **Referência regulatória**: Portaria SVS/MS 344/98 e RDC 20/2011 (controle especial), RDC 16/2007 (equivalência de genéricos);
- **Travas no checkout** (`CheckoutModal`) e modal informativo (`SafetyModal`).

---

## 🏗️ Arquitetura e estrutura de pastas

Aplicação **front-end only** (SPA). O estado global fica em `App.jsx` e é passado por *props*; o motor de IA é um serviço puro.

```
PagueMenos/
├── index.html                  # Entrada, fontes e metadados (pt-BR)
├── vite.config.js
├── package.json
├── public/                     # favicon e sprite de ícones
└── src/
    ├── main.jsx                # Bootstrap do React
    ├── App.jsx                 # Estado global, roteamento por estado, alternância mobile/desktop
    ├── index.css / App.css     # Design tokens, layout e moldura do iPhone
    ├── data/
    │   ├── catalog.js          # Catálogo de produtos + categorias
    │   └── intentPresets.js    # Jornadas e atalhos de 1 clique
    ├── services/
    │   └── aiCommerceEngine.js # Motor de IA Commerce (regras + segurança)
    └── components/
        ├── — Mobile —
        │   ├── MobileAppHeader.jsx
        │   ├── AiCommerceSearchBar.jsx   # Entrada da IA (texto, foto, PDF, exemplos)
        │   ├── AppActionCards / AppPromoBanners / AppCategories / AppProductGrid
        │   ├── AppBottomNav.jsx
        │   ├── AiChatResponseScreen.jsx  # Resposta da IA + refinamento + receita
        │   └── MobileAuthScreen.jsx
        ├── — Desktop —
        │   ├── Header.jsx / Footer.jsx
        │   ├── DesktopHomePage.jsx
        │   ├── AiGuidedBanner.jsx        # Entrada da IA logo abaixo da lupa
        │   ├── AiGuidedExperience.jsx
        │   ├── DesktopAiResponsePage.jsx
        │   ├── TraditionalCatalog.jsx
        │   └── DesktopAuthPage.jsx
        └── — Compartilhados —
            ├── CameraCaptureModal.jsx    # Webcam / galeria / presets de simulação
            ├── CartDrawer.jsx            # Sacola única (busca + IA)
            ├── CheckoutModal.jsx         # Entrega, pagamento, confirmação
            ├── SafetyModal.jsx           # Compliance ANVISA
            ├── UserProfilePage.jsx       # Área do cliente (6 abas)
            └── SiteNavigationModals.jsx  # Lojas, App, Ajuda, CEP
```

**Decisões de projeto**

- **Roteamento por estado** (`mobileScreen` / `desktopPage`) em vez de biblioteca de rotas — suficiente para o protótipo e fácil de acompanhar.
- **Motor desacoplado da UI** — a tela só chama `runAiCommerceEngine(config)` e renderiza o resultado; refinamentos reaplicam o motor com a configuração atualizada.
- **Um carrinho, duas origens** — cada item guarda `source: 'traditional' | 'ai'`.

---

## 🧰 Stack

| Camada | Tecnologia |
| :-- | :-- |
| UI | React 19 |
| Build / dev server | Vite 8 + `@vitejs/plugin-react` |
| Ícones | `lucide-react` |
| Lint | `oxlint` |
| Estilo | CSS puro com variáveis (design tokens) + estilos inline |
| Fontes | Outfit e Plus Jakarta Sans (Google Fonts) |

---

## 🚀 Como executar

**Pré-requisito:** Node.js 18+ (recomendado 20+) e npm.

```bash
# 1. Instalar dependências
npm install

# 2. Servidor de desenvolvimento
npm run dev
# → http://localhost:5173

# 3. Build de produção
npm run build

# 4. Pré-visualizar o build
npm run preview

# 5. Lint
npm run lint
```

### Roteiro de demonstração (2 minutos)

1. Abra no modo **📱 App Mobile** e toque em **Montar um kit** → *Kit Proteção Solar & Toque Seco*.
2. Na tela da IA, ative **genéricos** e mexa no **orçamento**; veja a cesta se reequilibrar.
3. Digite no chat de refinamento: *"tirar vitamina"* ou *"até 50 reais"*.
4. Adicione a cesta inteira à sacola e finalize com **Pix**.
5. Volte e envie *"preciso de Rivotril"* para ver a **trava de receita** em ação.
6. Abra a **câmera**, escolha o preset *Dorflex* com a intenção **genérico** e veja a economia calculada.
7. Troque para **💻 Site Desktop** e repita a jornada pela busca com IA logo abaixo da lupa.

> 💡 A câmera usa a webcam real quando o navegador permite; caso contrário, é possível testar com os **presets de simulação**.

---

## 🎨 Design e identidade visual

- **Paleta**: azul `#001FD8` (principal), vermelho `#E30613` (ofertas e destaques), verde `#008744` (saúde/economia), com neutros em tons de cinza-azulado.
- **Tipografia**: *Outfit* (títulos) e *Plus Jakarta Sans* (texto).
- **Princípios de UX**
  - **Sem fricção conversacional** — cartões interativos no lugar de mensagens longas;
  - **Controle sem recomeço** — ajustar não é refazer;
  - **Transparência** — sempre mostrar *por que* e *quanto se economiza*;
  - **Segurança visível** — selos e avisos fazem parte da experiência, não escondem a compra.

---

## 🧪 O que é real e o que é simulado

Este é um **protótipo de hackathon**. Para ser transparente sobre o estado atual:

| Funciona de verdade | Simulado / *mock* |
| :-- | :-- |
| Estado, carrinho, quantidades, totais e economia | **Catálogo** estático em `catalog.js` (imagens do Unsplash) |
| Motor de regras (tema, orçamento, genéricos, remoções) | **Interpretação de linguagem natural** por palavras-chave e regex — não há LLM |
| Webcam via `getUserMedia` | **Reconhecimento de medicamento na foto**: baseado em presets e no nome do arquivo, sem visão computacional |
| Fluxo de checkout e travas de receita | **Validação de receita**: resposta fixa simulada (não consulta Memed/CFM) |
| Responsividade entre as duas interfaces | **Login/cadastro, pagamento, pedidos e perfil**: dados de exemplo no front-end, sem backend |

---

## 🗺️ Roadmap

- [ ] **LLM com saída estruturada**: substituir as regras de texto por um modelo que devolva o mesmo contrato JSON que o motor já usa, mantendo as regras de segurança como camada determinística *por cima* da IA;
- [ ] **Visão computacional / OCR** para identificar embalagens e ler receitas;
- [ ] **Validação real de receitas digitais** (ICP-Brasil / Memed) e retenção de receita B/C;
- [ ] **Catálogo, estoque e preços reais** por loja (API da Pague Menos), com disponibilidade para Clique & Retire;
- [ ] **Personalização com histórico real** de compras e alertas de reposição;
- [ ] **Backend** para autenticação, pedidos e pagamentos;
- [ ] **Testes automatizados** do motor (é uma função pura, ideal para testes unitários);
- [ ] **Acessibilidade** (navegação por teclado, contraste, leitores de tela) e **i18n**.

---

## ⚠️ Aviso

Projeto **demonstrativo**, criado para fins de hackathon. As recomendações **não substituem** avaliação médica ou farmacêutica. Marcas, preços e dados de usuário exibidos são fictícios ou ilustrativos.