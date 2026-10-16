# 💊 Farmácia Pague Menos — Experiência de IA Commerce Guiada

Uma solução inovadora e criativa desenvolvida em **React** para o desafio de **IA Commerce da Farmácia Pague Menos**, projetada sob a diretriz fundamental do cliente: **NÃO é para construir mais um chatbot**.

---

## 🎯 O Desafio e a Solução Criativa

Consumidores habituaram-se a usar ChatGPT e Gemini para pesquisar produtos de saúde, bem-estar e cuidados. Porém, chatbots tradicionais no e-commerce são lentos, impessoais e geram atrito na conversão.

A solução criada integra uma **Compra Guiada por IA nativa**, diretamente na interface da Pague Menos, **posicionada logo abaixo da busca tradicional (lupa)**. 

### Diferencial Estratégico:
> **A Pague Menos não precisa ensinar o cliente a usar IA nem substituir a busca que já funciona.** A plataforma oferece suporte inteligente e consultivo exatamente no momento em que o consumidor tem uma intenção ou sintoma, mas não sabe quais produtos combinados escolher.

---

## 🏗️ Arquitetura das 7 Camadas do Projeto

| Parte do App | Implementação no Projeto | Função & Diferencial |
| :--- | :--- | :--- |
| **1. Página inicial** | [`src/components/Header.jsx`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/components/Header.jsx) + [`src/components/AiGuidedBanner.jsx`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/components/AiGuidedBanner.jsx) | Mantém a **lupa tradicional** no topo para buscas diretas e apresenta o **destaque de compra com IA** logo abaixo, explicando o benefício de forma clara e visual. |
| **2. Entrada da IA** | [`src/components/AiGuidedBanner.jsx`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/components/AiGuidedBanner.jsx) | Campo de texto livre para intenções naturais + botões de 1 clique para as jornadas solicitadas: **“Montar um kit”**, **“Comprar dentro do meu orçamento”** e **“Repetir minha compra”**. |
| **3. Inteligência de compra** | [`src/services/aiCommerceEngine.js`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/services/aiCommerceEngine.js) + [`src/components/AiGuidedExperience.jsx`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/components/AiGuidedExperience.jsx) | Interpreta a necessidade, teto de gastos e preferências. Apresenta **raciocínio farmacêutico transparente**, **slider de orçamento dinâmico** e **toggle de genéricos** para ajustar a seleção sem recomeçar a busca. |
| **4. Catálogo Integrado** | [`src/data/catalog.js`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/data/catalog.js) + [`src/components/TraditionalCatalog.jsx`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/components/TraditionalCatalog.jsx) | Fornece produtos reais (dermocosméticos, analgésicos, genéricos EMS/Neo Química, itens de bebê e primeiros socorros), com preços do Clube Sempre Bem e disponibilidade. |
| **5. Carrinho Compartilhado** | [`src/components/CartDrawer.jsx`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/components/CartDrawer.jsx) | Mantém juntos os itens da busca tradicional e as sugestões da IA (com badges distintas `✨ Sugerido por IA`), permitindo adicionar kits inteiros com 1 clique ou itens avulsos. |
| **6. Checkout & Finalização** | [`src/components/CheckoutModal.jsx`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/components/CheckoutModal.jsx) | Fluxo normal de checkout: escolha entre **Entrega Turbo (em até 1h via motoboy)** ou **Clique & Retire (Grátis em 30 min na loja)**, Pix com desconto extra e confirmação com rastreio. |
| **7. Camada de Segurança** | [`src/components/SafetyModal.jsx`](file:///c:/Users/user/OneDrive/Desktop/rafaella/PagueMenos/src/components/SafetyModal.jsx) + Travas Sanitárias no Checkout | Cumpre rigorosamente a legislação sanitária ANVISA (Portaria 344/98 e RDC 20/2011). Exige envio de receita para medicamentos tarjados, alerta para consulta médica e destaca supervisão de Farmacêutico Responsável (CRF). |

---

## 🚀 Como Executar o Projeto Localmente

1. **Instalar dependências (caso necessário):**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar no navegador:**
   Abra `http://localhost:5173/` para interagir com a aplicação em tempo real.

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 💡 Destaques de UX e Design

- **Identidade Visual Farmácia Pague Menos:** Paleta com Vermelho `#D81A24`, Azul Petróleo `#003B71` e Verde Saúde `#008850`, com tipografias *Outfit* e *Plus Jakarta Sans*.
- **Sem Fricção de Conversação:** Em vez de trocar mensagens em um chat flutuante, o usuário clica e vê a cesta de produtos montada em cartões interativos em milissegundos.
- **Régua de Ajuste de Orçamento em Tempo Real:** Usuário ajusta o limite de valor (ex: R$ 40 a R$ 180) e os itens reequilibram instantaneamente.
- **Botão Otimizador de Genéricos:** Alterna remédios de marca de referência para genéricos certificados, gerando economia imediata de até 46%.
