# 💊 Pague Menos — Farmácia Digital Inteligente & IA Commerce

### Da intenção em linguagem natural à compra finalizada — com 4 camadas de guardrails da ANVISA, RAG vetorial no catálogo oficial e tolerância zero a alucinações de preço.

[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%208-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115%2B%20%2B%20Python%203.11-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![ANVISA Compliance](https://img.shields.io/badge/Compliance-ANVISA%20RDC%2020%2F2011%20%26%2044%2F2009-E30613?logo=shield)](https://www.gov.br/anvisa)
[![LGPD](https://img.shields.io/badge/Privacidade-LGPD%20Lei%2013.709-001FD8)](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
[![Licença](https://img.shields.io/badge/Projeto-Hacka%20Business%20REC'n'Play%202026-F59E0B)](https://recnplay.pe/)

> **Projeto desenvolvido para o desafio IA Commerce · Hacka Business REC'n'Play 2026 (Desafio Pague Menos).**  
> Este documento unifica e detalha minuciosamente a arquitetura, funcionalidades, contratos de API, guia de execução e aspectos de segurança do **Frontend** (React 19 + Vite 8) e do **Backend** (FastAPI + Python 3.11).

---

## 📑 Sumário Executivo

1. [Visão Geral do Projeto](#-visão-geral-do-projeto)
2. [Arquitetura Geral do Sistema](#️-arquitetura-geral-do-sistema)
3. [Inicialização Rápida (1 Clique)](#-inicialização-rápida-1-clique)
4. [Inicialização Manual Passo a Passo](#-inicialização-manual-passo-a-passo)
5. [Frontend em Detalhe (React 19 + Vite 8)](#-frontend-em-detalhe)
   - [Página Inicial Desktop (DesktopHomePage)](#1-página-inicial-desktop-desktophomepagejsx)
   - [Compra Guiada por IA (DesktopAiResponsePage)](#2-cesta-da-ia-em-página-dedicada-desktopairesponsepagejsx)
   - [Autenticação Fixa Edge-to-Edge (DesktopAuthPage)](#3-tela-de-autenticação-fixa-edge-to-edge-desktopauthpagejsx)
   - [Gaveta Lateral de Carrinho (CartDrawer)](#4-gaveta-lateral-de-carrinho-slide-over-cartdrawerjsx)
   - [Área de Checkout e Pagamentos (DesktopCheckoutPage)](#5-área-de-checkout-e-pagamento-dedicada-desktopcheckoutpagejsx)
   - [Scanner e Leitor de Receitas (CameraCaptureModal)](#6-câmera--leitor-de-receitas-cameracapturemodaljsx)
   - [Assistente Farmacêutica Sofia (ChatbotWidget)](#7-farmacêutica-digital-sofia-chatbotwidgetjsx)
   - [Área do Cliente e Cofre de Receitas (UserProfilePage)](#8-área-do-cliente-userprofilepagejsx)
6. [Backend em Detalhe (FastAPI + Python 3.11)](#-backend-em-detalhe)
   - [Estrutura de Camadas e Repositórios](#estrutura-de-camadas-e-repositórios)
   - [Motor RAG Vetorial e Embeddings](#motor-rag-vetorial-e-embeddings)
   - [Agente LLM Seguro com Fallback Determinístico](#agente-llm-seguro-com-fallback-determinístico)
7. [As 4 Camadas de Guardrails Sanitários da ANVISA](#-as-4-camadas-de-guardrails-sanitários-da-anvisa)
8. [Referência Completa da API REST (Endpoints e Payloads)](#-referência-completa-da-api-rest)
9. [Integração Front ⇄ Back e Resiliência](#-integração-front--back-e-resiliência)
10. [Fluxo de Autenticação, Tokens e Sessões](#-fluxo-de-autenticação-tokens-e-sessões)
11. [Carrinho, Checkout e Métodos de Pagamento](#-carrinho-checkout-e-métodos-de-pagamento)
12. [Câmera, Leitura de Receitas e OCR](#-câmera-leitura-de-receitas-e-ocr)
13. [Estrutura Completa de Pastas](#-estrutura-completa-de-pastas)
14. [Stack Técnica e Matriz de Dependências](#-stack-técnica-e-matriz-de-dependências)
15. [Variáveis de Ambiente (.env)](#-variáveis-de-ambiente-env)
16. [Testes, Qualidade e Smoke Tests](#-testes-qualidade-e-smoke-tests)
17. [Deploy em Produção (Vercel + Render / Docker)](#-deploy-em-produção-vercel--render--docker)
18. [Segurança, Compliance Regulatório e LGPD](#-segurança-compliance-regulatório-e-lgpd)
19. [FAQ e Solução de Problemas](#-faq-e-solução-de-problemas)
20. [Licença e Créditos](#-licença-e-créditos)

---

## 🎯 Visão Geral do Projeto

Consumidores já utilizam ferramentas generativas (ChatGPT, Gemini) para tirar dúvidas de saúde e bem-estar. No entanto, assistentes de e-commerce convencionais costumam ser lentos, genéricos e operam como chatbots isolados com alto atrito até a conversão.

O desafio do **Hacka Business REC'n'Play 2026** propôs **repensar o comércio farmacêutico para uma jornada fluida que começa na intenção do usuário (texto, voz, foto de caixa ou receita) e termina na compra finalizada** — personalizada, segura, transparente e integrada ao catálogo real da rede Pague Menos.

### A Solução Implementada

Em vez de um chatbot tradicional em janela pop-up, a plataforma entrega uma **experiência omnicanal de Compra Guiada nativa**:
- **Interpretação Semântica:** Reconhece linguagem coloquial, queixas cotidianas, teto orçamentário e restrições (ex.: alergias, preferência por genéricos).
- **Cesta Pronta em Cartões Interativos:** Não responde com blocos de texto; monta a cesta diretamente na tela com produtos reais, dosagens, fotos oficiais e preços de Clube Sempre Bem.
- **Transparência Farmacêutica:** Explica a justificativa de cada item (função clínica, alívio sintomático e equivalência bioequivalente de genéricos).
- **Flexibilidade sem Reinício:** Permite ao cliente ajustar orçamento (slider dinâmico), trocar por similar mais barato e remover produtos com recálculo instantâneo.
- **Rigor Regulatório:** Bloqueia terminantemente prescrições médicas de medicamentos controlados (**RDC 20/2011 e RDC 44/2009 da ANVISA**).

### Matriz de Responsabilidades

| Camada | Tecnologia | Responsabilidade Principal |
| :-- | :-- | :-- |
| **Frontend** | React 19, Vite 8, Lucide React, Vanilla CSS | Interface desktop de alta fidelidade: Home desktop, busca preditiva, Compra Guiada IA, Chatbot interativo Sofia, leitura de câmera/OCR, gaveta de carrinho slide-over, checkout completo com pagamentos (Pix, Cartão, Boleto), tela de login/cadastro fixa edge-to-edge e perfil do usuário. |
| **Backend** | FastAPI, Python 3.11, Pydantic 2, Uvicorn | Orquestração segura: pipeline de RAG vetorial sobre catálogo de 500 produtos em Parquet, execução das 4 camadas de guardrails determinísticos, validação anti-alucinação, persistência de pedidos, sessões, autenticação e auditoria de prontidão. |

> ### ⚖️ Regra Inegociável de Segurança Farmacêutica
> **O Modelo de Linguagem (LLM) nunca decide se uma resposta ou venda é segura.** Quem decide são funções determinísticas puras, testáveis e auditáveis em milissegundos. Se qualquer guardrail for acionado, o bloqueio regulatório é imediato e nenhum produto controlado é ofertado sem receita retida.

---

## 🏗️ Arquitetura Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NAVEGADOR CLIENTE (DESKTOP / MOBILE)                  │
│                        http://localhost:5173 (Vite 8 + React 19)            │
│                                                                             │
│  [Header Preditivo]   [Busca Tradicional]   [Compra Guiada por IA]          │
│  [Chatbot Sofia 24h]  [Câmera / Scanner]    [Gaveta de Cesta Slide-over]    │
│  [Checkout Completo]  [Login/Cadastro Fixo] [Perfil do Cliente & Cofre]     │
│                                                                             │
│  src/services/api.js ───────────── Cliente REST unificado com cache local   │
│  src/services/authService.js ───── Sessões, tokens e persistência           │
│  src/services/aiCommerceEngine.js ─ Motor híbrido (Backend + Fallback local)│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                      Proxy do Vite:   │ fetch('/api/*') 
                 (Dev: proxy na 5173)  │ (Prod: VITE_API_URL direto)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND FASTAPI (PYTHON 3.11)                          │
│                      http://127.0.0.1:8000 (Uvicorn 0.34)                   │
│                                                                             │
│  ROUTERS:                                                                   │
│  ├── /chat         Orquestrador de IA, RAG e Guardrails                     │
│  ├── /products     Catálogo em Parquet com paginação e filtros              │
│  ├── /cart         Carrinho em memória indexado por session_id              │
│  ├── /checkout     Conclusão de pedidos, cálculo de frete e pagamento       │
│  ├── /orders       Histórico de compras e rastreamento                      │
│  ├── /auth         Registro, login, perfil, JWT / Bearer tokens             │
│  ├── /camera       Upload de fotos de caixas, receitas e OCR                │
│  └── /audit        Auditoria de prontidão para produção (/audit/readiness)  │
│                                                                             │
│  PIPELINE ORCHESTRATOR:                                                     │
│  ┌────────────────┐     ┌──────────────┐     ┌────────────────────────┐     │
│  │ 1. Guardrail   │ ──► │ 2. RAG Busca │ ──► │ 3. Guardrail Conteúdo  │ ──┐  │
│  │    Intenção    │     │    Vetorial  │     │    & Estoque Sanitário │   │  │
│  └────────────────┘     └──────────────┘     └────────────────────────┘   │  │
│                                                                           │  │
│  ┌────────────────────────────────────────────────────────────────────┐   │  │
│  │ 4. LLM Agent (OpenAI gpt-4o-mini) + Anti-Alucinação / Fallback     │ ◄─┘  │
│  └────────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  DADOS & ARMAZENAMENTO:                                                     │
│  - data/paguemenos_catalog.parquet (500 produtos oficiais catalogados)      │
│  - data/users.json & data/sessions.json (contas e credenciais com hash)     │
│  - data/orders.json (pedidos registrados no checkout)                       │
│  - data/camera_captures.json & camera_uploads/ (prescrições e imagens)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Inicialização Rápida (1 Clique)

O projeto inclui scripts inteligentes que detectam o ambiente, criam o ambiente virtual Python (`.venv`), instalam dependências faltantes, preparam os arquivos `.env` e iniciam ambos os servidores sincronizados:

### No Windows
- **Opção A (Mais Simples):** Dê um duplo clique no arquivo [`start.bat`](file:///c:/Users/rafae/OneDrive/Desktop/Rafa/PagueMenos/start.bat).
- **Opção B (PowerShell):** Execute `.\start.ps1`.
- Duas janelas dedicadas do console se abrirão (Backend na porta 8000 e Frontend na porta 5173). O navegador será aberto automaticamente em `http://localhost:5173`.

### No Linux / macOS / WSL
```bash
chmod +x start.sh start_backend.sh start_frontend.sh
./start.sh
```
Pressione `Ctrl + C` no terminal para encerrar ambos os serviços de forma limpa.

---

## 🛠️ Inicialização Manual Passo a Passo

Caso prefira iniciar cada processo separadamente em seus próprios terminais:

### Terminal 1 — Backend (Porta 8000)
```bash
# 1. Navegue até o diretório do backend
cd ../back_PagueMenos/PagueMenosBackend
# ou se estiver na mesma pasta raiz: cd back_PagueMenos/PagueMenosBackend

# 2. Crie e ative o ambiente virtual Python (3.11 recomendado)
python -m venv .venv

# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Configure as variáveis de ambiente (se ainda não configurado)
# Windows: copy .env.example .env | Linux/macOS: cp .env.example .env

# 5. Inicie o servidor Uvicorn
uvicorn app.main:app --reload --port 8000
```
- Acesse `http://localhost:8000/health` para validar o status (`{"status":"ok"}`).
- Acesse `http://localhost:8000/docs` para interagir com o Swagger interativo.

### Terminal 2 — Frontend (Porta 5173)
```bash
# 1. Navegue até a pasta do frontend
cd PagueMenos

# 2. Instale os pacotes npm
npm install

# 3. Inicie o servidor Vite
npm run dev
```
- Acesse **`http://localhost:5173`** no seu navegador.

---

## 💻 Frontend em Detalhe

O frontend foi desenvolvido com foco em estética premium, velocidade de resposta e máxima transparência para o usuário.

### 1. Página Inicial Desktop (`DesktopHomePage.jsx`)
- **Header Inteligente (`Header.jsx`):**
  - Busca preditiva com debounce em tempo real e auto-complete de categorias.
  - Gatilho rápido para busca visual via câmera / upload de receita.
  - Seletor de CEP com persistência local e cálculo instantâneo de entrega Turbo.
  - Indicador dinâmico de itens no carrinho com contagem em tempo real.
- **Hero Banner Interativo:**
  - Atalhos em linguagem natural para queixas comuns ("Dor de cabeça forte", "Gripe e imunidade", "Protetor solar e pele", "Azia e digestão").
  - Campo de entrada com botão de envio para a Compra Guiada.
- **Carrossel "Piscou Perdeu":**
  - Ofertas relâmpago com contador regressivo em tempo real.
  - Botão de adição instantânea à cesta sem redirecionamento.
- **Jornadas por Sintomas & Categorias:**
  - Navegação visual por especialidades de saúde, higiene pessoal, dermocosméticos e mamães & bebês.

### 2. Cesta da IA em Página Dedicada (`DesktopAiResponsePage.jsx`)
- Exibição da cesta completa recomendada pelo motor de IA com fotos oficiais e preços de Clube Sempre Bem.
- **Explicação Clínica Transparente:** Cada produto exibe um cartão com princípio ativo, ação farmacológica e o porquê foi escolhido.
- **Controles de Personalização em Tempo Real:**
  - **Slider de Orçamento:** Ajusta o teto de gastos de R$ 10 a R$ 200, recalculando os itens da cesta em tempo real.
  - **Filtro de Genéricos:** Alterna automaticamente itens de marca por genéricos bioequivalentes, exibindo a economia em Reais gerada.
  - **Dropdown de Alergias:** Permite selecionar restrições conhecidas (ex.: Alergia a Dipirona, Ácido Acetilsalicílico, Paracetamol) com exclusão imediata e substituição por molécula segura.

### 3. Tela de Autenticação Fixa Edge-to-Edge (`DesktopAuthPage.jsx`)
- **Arquitetura 100vw × 100vh Sem Scroll:** Projetada especificamente para eliminar o efeito de modal flutuante com fundo borrado. Toda a interface fica visível e operável em uma única tela, sem scrollbars indesejadas em monitores padrão (~730px de altura útil).
- **Coluna Esquerda (42% — Gradiente Azul Pague Menos):**
  - Header institucional com cápsula branca contendo o logo oficial e tagline.
  - **4 Cards de Benefícios em Glassmorphism:**
    1. *Até 95% de Desconto* (Badge: Sempre Bem).
    2. *Cofre de Receitas CRM* (Badge: ANVISA).
    3. *Entrega Turbo em 1h* (Badge: 45-60 min).
    4. *R$ 15 OFF no 1º Pedido* (Badge: BEMVINDO15).
  - **Métricas de Confiança:** `+1.600 Lojas físicas`, `24h Farmacêutica Sofia`, `45min Entrega Turbo`.
  - Rodapé com selos de conformidade ANVISA RDC 44/2009 e LGPD.
- **Coluna Direita (58% — Formulário Interativo Clean):**
  - Alternância fluida entre "Entrar na Conta" e "Criar Cadastro Grátis".
  - Login social direto com **Gov.br** (para importação e validação de prescrições digitais do SUS e CFM) e **Google Sign-In**.
  - **Botões de Preenchimento Rápido (1 Clique):** Atalho para testar como `Rafaella Guedes` ou gerar conta demo instantânea.
  - Validação e máscara de CPF (`000.000.000-00`), telefone e exibição/ocultação de senha.
  - Modo logado dinâmico com resumo da conta, pontos Sempre Bem e botões para voltar à loja ou acessar o perfil.

### 4. Gaveta Lateral de Carrinho Slide-Over (`CartDrawer.jsx`)
- Painel lateral fixo deslizante (`position: fixed`, alinhado à direita, `maxWidth: 480px`, `zIndex: 99999`).
- **Barra de Progresso do Frete Grátis Turbo:** Meta visual de R$ 99,00 com cálculo dinâmico do valor restante para isenção da taxa de entrega.
- **Seleção Múltipla de Itens:** Checkbox geral ("Selecionar todos") e individual para permitir compras fracionadas sem remover itens da cesta.
- **Botão de Ação Primário de Alto Impacto:**
  - Texto em destaque: **"Finalizar Compra • Ir para Pagamento (Pix, Cartão ou Boleto)"**.
  - Exibe o valor total selecionado, ícone de cartão e selo de segurança SSL.
  - Navega diretamente para a página de checkout (`DesktopCheckoutPage`).
- **Estado de Carrinho Vazio Amigável:**
  - Botão "✨ Adicionar Itens e Ir para Pagamento" (adiciona automaticamente Dipirona EMS e Dorflex 36 e transiciona para o checkout).
  - Botão para ir direto ao checkout.
  - Botão para continuar navegando na loja.

### 5. Área de Checkout e Pagamento Dedicada (`DesktopCheckoutPage.jsx`)
- Página completa de finalização sem modais intermediários.
- **Gestão de Endereços:** Seleção rápida de endereços salvos ou cadastro de novo CEP com cálculo dinâmico de taxa e prazo.
- **3 Modalidades de Entrega:**
  1. ⚡ *Turbo Express (45 min):* R$ 9,90 (ou Grátis acima de R$ 99).
  2. 📦 *Econômica no mesmo dia:* R$ 5,90.
  3. 🏪 *Clique & Retire Express em 1h:* 100% Grátis na loja mais próxima.
- **4 Métodos de Pagamento Interativos:**
  1. 💠 **Pix à Vista:** Aplica 5% de desconto imediato, gera QR Code dinâmico com chave EMV Copia e Cola, contador regressivo e simulador de aprovação em tempo real.
  2. 💳 **Cartão de Crédito:** Pré-visualização gráfica do cartão em tempo real, detecção automática de bandeiras (Visa, Mastercard, Elo, Hipercard, Amex), validação por algoritmo de Luhn, CVV e parcelamento em até 6x sem juros.
  3. 📄 **Boleto Bancário:** Geração de código de barras simulado para impressão, linha digitável copiável e vencimento em 3 dias úteis.
  4. 🏥 **Convênio Farmácia / PBM:** Desconto em folha e subsídios corporativos.
- **Motor de Cupons:** Suporte a códigos promocionais como `BEMVINDO15` (R$ 15 OFF), `TURBO10` (10% OFF) e `SEMPREBEM` (Frete Grátis).
- **Validação de Receita Retida:** Alerta automático caso o carrinho contenha medicamentos sob prescrição médica obrigatória.
- **Confirmação com Chuva de Confetes (`canvas-confetti`):** Exibe o protocolo oficial do pedido (`FV-XXXXXX`) e grava o registro no backend.

### 6. Câmera & Leitor de Receitas (`CameraCaptureModal.jsx`)
- Acesso à webcam do dispositivo via API nativa HTML5 `navigator.mediaDevices.getUserMedia`.
- **Seletor de Modo Duplo:**
  - *Embalagem de Medicamento:* Identifica caixas, extrai dosagem e sugere produtos idênticos ou genéricos bioequivalentes mais baratos.
  - *Receita Médica / Exame:* Digitaliza receituários com carimbo/CRM e armazena a receita no Cofre Digital do cliente.
- Fallback elegante para upload de arquivos de imagem ou PDF caso o usuário não possua webcam ativa.

### 7. Farmacêutica Digital Sofia (`ChatbotWidget.jsx`)
- Assistente virtual flutuante disponível 24 horas.
- Simulação de digitação em tempo real com sugestões contextuais.
- Orientações de uso não prescritivas (posologia básica de bula, horários recomendados, orientações alimentares).

### 8. Área do Cliente (`UserProfilePage.jsx`)
- Histórico completo de pedidos com rastreador visual de etapas (Confirmado → Em Separação → Saiu para Entrega → Entregue).
- **Cofre de Receitas Digitais:** Repositório seguro com visualização de receitas anexadas e status de validação farmacêutica.
- Botão de recompra com 1 clique para compras recorrentes.
- Extrato de pontos do Clube Sempre Bem e dados cadastrais.

---

## ⚙️ Backend em Detalhe

Construído sobre o framework **FastAPI**, o backend foi estruturado seguindo princípios de arquitetura limpa, separação de responsabilidades e desacoplamento de repositórios.

### Estrutura de Camadas e Repositórios

```text
back_PagueMenos/PagueMenosBackend/
├── app/
│   ├── main.py                     # Inicialização da API, middlewares CORS e rotas
│   ├── config.py                   # Configurações tipadas via pydantic-settings
│   ├── core/
│   │   ├── guardrails.py           # As 4 camadas de filtros sanitários da ANVISA
│   │   ├── rag_engine.py           # Motor de busca vetorial (TF-IDF e Embeddings)
│   │   ├── llm_agent.py            # Agente OpenAI com verificação anti-alucinação
│   │   ├── catalog_loader.py       # Leitor otimizado do catálogo Parquet
│   │   └── orchestrator.py         # Pipeline sequencial de atendimento da IA
│   ├── routers/
│   │   ├── chat_router.py          # Endpoint POST /chat
│   │   ├── products_router.py      # Endpoints GET /products e GET /products/{id}
│   │   ├── cart_router.py          # Endpoints de gestão de carrinho
│   │   ├── checkout_router.py      # Endpoint POST /checkout
│   │   ├── orders_router.py        # Endpoints de histórico de pedidos
│   │   ├── auth_router.py          # Endpoints de login, cadastro e perfil
│   │   ├── camera_router.py        # Endpoints de upload e captura de receitas
│   │   └── audit_router.py         # Endpoint /audit/readiness
│   ├── schemas/                    # Schemas Pydantic v2 para validação de entrada/saída
│   └── repositories/
│       ├── product_repo.py         # Consulta ao catálogo em memória (DataFrame Parquet)
│       ├── cart_repo.py            # Carrinho em memória indexado por session_id
│       ├── order_repo.py           # Persistência de pedidos em data/orders.json
│       ├── user_repo.py            # Persistência de usuários em data/users.json
│       └── camera_repo.py          # Armazenamento de uploads em data/camera_captures.json
├── data/
│   ├── paguemenos_catalog.parquet  # Catálogo oficial com 500 produtos
│   ├── users.json                  # Banco de dados de usuários
│   ├── sessions.json               # Sessões ativas indexadas
│   ├── orders.json                 # Pedidos concluídos
│   └── camera_captures.json        # Metadados de imagens capturadas
├── requirements.txt                # Dependências Python
└── Dockerfile                      # Imagem Docker otimizada para produção
```

### Motor RAG Vetorial e Embeddings

O motor RAG vetorial (`app/core/rag_engine.py`) indexa os 500 produtos oficiais catalogados em `paguemenos_catalog.parquet`. Cada item possui:
- `product_id`: EAN/SKU oficial de 13 dígitos.
- `nome`: Descrição completa do produto com dosagem e forma farmacêutica.
- `marca`: Laboratório farmacêutico ou fabricante.
- `preco`: Preço oficial de venda.
- `categoria`: Segmento farmacêutico.
- `is_prescription`: Booleano determinando necessidade de retenção de receita médica.

O sistema suporta dois motores vetoriais configuráveis via `.env`:
1. **TF-IDF + Similaridade de Cosseno (Recomendado para Dev e Hackathons):**
   - Utiliza `scikit-learn`.
   - Inicialização em menos de **100 milissegundos**.
   - Zero dependência de pesos pesados de redes neurais.
2. **Sentence-Transformers (`all-MiniLM-L6-v2`):**
   - Embeddings neurais densos de 384 dimensões via PyTorch.
   - Compreensão semântica profunda de sinônimos médicos.

### Agente LLM Seguro com Fallback Determinístico

O agente de linguagem (`app/core/llm_agent.py`) opera sob rigorosas travas de segurança:
- **LLM Habilitado (`LLM_ENABLED=true`):** Comunica-se com a OpenAI (`gpt-4o-mini`) injetando o catálogo recuperado pelo RAG no prompt do sistema com instruções explícitas de não alucinar.
- **LLM Desabilitado (`LLM_ENABLED=false`) ou Queda de Conexão:** O sistema aciona o **Gerador de Resposta Determinístico**, montando a resposta diretamente dos metadados do catálogo sem consumir créditos de API externa.

---

## 🛡️ As 4 Camadas de Guardrails Sanitários da ANVISA

Para garantir total conformidade com a legislação sanitária brasileira (**RDC 20/2011 e RDC 44/2009 da ANVISA**), toda interação passa obrigatoriamente por 4 barreiras determinísticas:

```
                  ┌─────────────────────────────────────┐
                  │      CONSULTA DO USUÁRIO            │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │  CAMADA 1: FILTRO DE INTENÇÃO (Gatilhos Clínicos)       │
        │  - Bloqueia: Diagnóstico, Dosagem, Prescrição médica,   │
        │              Uso na Gravidez e Substituição de Receita  │
        └────────────────────────────┬────────────────────────────┘
                         [Aprovado]  │  [Reprovado] ──► Bloqueio Imediato
                                     ▼                 (Nenhum produto retornado)
        ┌─────────────────────────────────────────────────────────┐
        │  RAG: BUSCA VETORIAL NO CATÁLOGO OFICIAL                │
        │  - Recupera os top-K produtos por similaridade semântica│
        └────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │  CAMADA 2: FILTRO DE CONTEÚDO (Tarja e Receita)         │
        │  - Descarta qualquer item com is_prescription=True      │
        └────────────────────────────┬────────────────────────────┘
                         [Aprovado]  │  [Sem produtos seguros] ──► Aviso ANVISA
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │  CAMADA 3: FILTRO DE DISPONIBILIDADE E ESTOQUE          │
        │  - Remove itens fora de estoque ou descontinuados       │
        └────────────────────────────┬────────────────────────────┘
                         [Aprovado]  │
                                     ▼
        ┌─────────────────────────────────────────────────────────┐
        │  CAMADA 4: VALIDAÇÃO ANTI-ALUCINAÇÃO DO LLM             │
        │  - Valida se preços citados batem com o catálogo        │
        │  - Garante que nenhum product_id foi inventado          │
        │  - Verifica termos proibidos na redação do texto        │
        └────────────────────────────┬────────────────────────────┘
                         [Aprovado]  │  [Reprovado] ──► Fallback Determinístico
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    RESPOSTA SEGURA ENTREGUE AO FRONT│
                  └─────────────────────────────────────┘
```

### Resumo das 4 Camadas:
1. **Camada 1 (Intenção):** Analisa o prompt em busca de expressões que exigem ato médico exclusivo (ex.: *"qual a dosagem para meu filho de 3 anos?"*, *"substitua meu clonazepam"*). Responde orientando a busca de atendimento médico presencial.
2. **Camada 2 (Conteúdo & Tarja):** Se a busca vetorial recuperar itens tarjados ou antimicrobianos (que exigem retenção de receita conforme RDC 20/2011), esses itens são purgados antes da entrega ao usuário.
3. **Camada 3 (Estoque & Disponibilidade):** Apenas itens com flag `disponivel=True` no catálogo são ofertados.
4. **Camada 4 (Anti-Alucinação):** Se o LLM citar um preço diferente do cadastrado no Parquet ou sugerir um SKU inexistente, a resposta inteira é descartada e substituída por template determinístico oficial.

---

## 📚 Referência Completa da API REST

### 1. Sistema & Saúde

#### `GET /health`
Verifica a integridade do backend, contagem de produtos carregados e backend de embedding ativo.
- **Resposta (`200 OK`):**
```json
{
  "status": "ok",
  "service": "PagueMenos Backend - IA Commerce",
  "version": "1.0.0",
  "catalog_loaded": true,
  "catalog_total": 500,
  "embedding_backend": "tfidf"
}
```

---

### 2. Produtos & Catálogo

#### `GET /products`
Lista os produtos do catálogo com suporte a paginação e filtros.
- **Query Params:**
  - `categoria` *(string, opcional)*: Filtra por categoria (ex.: `Medicamentos`, `Dermocosméticos`).
  - `apenas_disponiveis` *(boolean, default `true`)*: Filtra por disponibilidade de estoque.
  - `limite` *(int, default `100`)*: Quantidade de itens por página.
  - `offset` *(int, default `0`)*: Ponto de partida para paginação.
  - `ids` *(string, opcional)*: Lista de IDs separados por vírgula.
- **Resposta (`200 OK`):**
```json
[
  {
    "product_id": "7896004701234",
    "nome": "Dipirona Monoidratada 500mg 10 Comprimidos",
    "marca": "EMS Genéricos",
    "preco": 4.89,
    "categoria": "Medicamentos/Dor e Febre",
    "disponivel": true,
    "is_prescription": false
  }
]
```

#### `GET /products/{id}`
Retorna os detalhes de um produto específico pelo código de barras/ID.

---

### 3. Orquestração de IA & Compra Guiada

#### `POST /chat`
Processa a mensagem do usuário executando o pipeline RAG + 4 Camadas de Guardrails.
- **Requisição:**
```json
{
  "session_id": "c8a41103-6f8e-49b8-b7eb-d069c9b13970",
  "message": "estou com dor de cabeça forte, tem algo em conta?"
}
```

- **Resposta com Produtos Aprovados (`200 OK`):**
```json
{
  "tipo": "produto",
  "mensagem": "Com base nos sintomas informados, separei analgésicos e antitérmicos seguros...",
  "produtos": [
    {
      "product_id": "7896004701234",
      "nome": "Dipirona Monoidratada 500mg 10 Comprimidos",
      "marca": "EMS Genéricos",
      "preco": 4.89,
      "categoria": "Medicamentos",
      "disponivel": true,
      "is_prescription": false,
      "motivo_recomendacao": "Analgésico de ação rápida com preço subsidiado de genérico."
    }
  ],
  "guardrail_acionado": null,
  "fontes": ["Catálogo Oficial Pague Menos"],
  "fallback_llm": false
}
```

- **Resposta com Bloqueio Regulatório (Ex.: Pedido de Dosagem):**
```json
{
  "tipo": "bloqueio_intencao",
  "mensagem": "Identificamos uma pergunta sobre dosagem ou diagnóstico clínico. De acordo com as normas da ANVISA, a dosagem correta deve ser avaliada individualmente por um médico ou farmacêutico presencial.",
  "produtos": [],
  "guardrail_acionado": "1_dosagem",
  "fontes": [],
  "fallback_llm": false
}
```

---

### 4. Carrinho de Compras

#### `GET /cart?session_id={id}`
Consulta os itens atualmente presentes no carrinho da sessão.

#### `POST /cart/items`
Adiciona um produto ao carrinho. Se o produto exigir receita médica (`is_prescription: true`), o backend rejeita com **`403 Forbidden`**.
- **Requisição:**
```json
{
  "session_id": "c8a41103-6f8e-49b8-b7eb-d069c9b13970",
  "product_id": "7896004701234",
  "quantidade": 2
}
```

#### `PUT /cart/items/{product_id}`
Atualiza a quantidade de um item no carrinho.
- **Requisição:** `{"session_id": "...", "quantidade": 3}`

#### `DELETE /cart/items/{product_id}?session_id={id}`
Remove o produto do carrinho.

---

### 5. Checkout & Pedidos

#### `POST /checkout`
Finaliza a compra e armazena o pedido registrado em `data/orders.json`.
- **Requisição:**
```json
{
  "session_id": "c8a41103-6f8e-49b8-b7eb-d069c9b13970",
  "user_id": "user_1",
  "address": {
    "street": "Av. Paulista",
    "number": "1000",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01310-100"
  },
  "payment_method": "pix",
  "delivery_type": "turbo",
  "items": [
    {
      "product_id": "7896004701234",
      "nome": "Dipirona Monoidratada 500mg",
      "preco": 4.89,
      "quantidade": 2
    }
  ],
  "subtotal": 9.78,
  "savings": 2.40,
  "total": 9.78
}
```
- **Resposta (`200 OK`):**
```json
{
  "success": true,
  "order_id": "FV-847291",
  "status": "aprovado",
  "payment_status": "pago",
  "total": 9.78,
  "created_at": "2026-10-26T16:45:00.000Z",
  "delivery_estimate": "Entrega Turbo em até 45 minutos"
}
```

#### `GET /orders?user_id={id}`
Consulta o histórico de pedidos de um cliente.

---

### 6. Autenticação & Usuários

#### `POST /auth/register`
Registra novo usuário no sistema (`data/users.json`).
- **Requisição:**
```json
{
  "name": "Maria Silva",
  "email": "maria.silva@email.com",
  "cpf": "123.456.789-00",
  "phone": "(81) 98765-4321",
  "birthDate": "1990-05-20",
  "password": "SenhaSegura@2026"
}
```

#### `POST /auth/login`
Autentica por CPF ou e-mail, gerando token Bearer e dados de perfil.

#### `POST /auth/logout`
Revoga a sessão ativa do usuário.

#### `GET /auth/me?user_id={id}`
Retorna dados cadastrais, pontos de fidelidade e cupons ativos.

---

### 7. Câmera, Receitas e Auditoria

#### `POST /camera/capture`
Armazena a imagem da receita capturada, dados do médico (CRM) e medicamentos detectados via OCR em `data/camera_captures.json`.

#### `GET /camera/prescriptions?user_id={id}`
Recupera o cofre de receitas ativas do cliente.

#### `GET /audit/readiness`
Gera relatório instantâneo de conformidade para auditoria técnica e regulatória.

---

## 🔌 Integração Front ⇄ Back e Resiliência

### Estratégia de Rede e Redirecionamento de Proxy
- **Em Desenvolvimento (Dev):** O Vite intercepta todas as chamadas `/api/*` e as encaminha de forma transparente para `http://127.0.0.1:8000`:
  ```javascript
  // vite.config.js
  export default defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  });
  ```
- **Em Produção (Prod):** O frontend lê a variável `VITE_API_URL` (ex.: `https://paguemenos-api.onrender.com`). As chamadas REST ocorrem diretamente via HTTPS com credenciais CORS liberadas.

### Tolerância a Falhas e Contingência Local
Se o backend for reiniciado ou estiver temporariamente offline, o frontend aciona automaticamente o **Modo de Contingência Local (`src/services/aiCommerceEngine.js`)**:
- Catálogo de fallback pré-carregado com 50 produtos essenciais.
- Guardrails determinísticos locais em JavaScript puro.
- Sessão e carrinho persistidos em `localStorage` e `sessionStorage`.
- Banner discreto no cabeçalho indicando operação em modo de segurança offline.

---

## 🔐 Fluxo de Autenticação, Tokens e Sessões

1. **Sessão Anônima Segura:**
   - Ao acessar a plataforma, é gerado um identificador único de sessão `pm_session_id` (`crypto.randomUUID()`).
   - Garante a privacidade dos itens adicionados à cesta antes do login (em conformidade com a LGPD).
2. **Login com Credenciais Oficiais:**
   - Validação de CPF formatado e sanitizado (somente dígitos).
   - Senhas com validação de complexidade mínima.
   - Emissão de Bearer token JWT para autorização em endpoints sensíveis (`/orders`, `/camera/prescriptions`).
3. **Integração Gov.br:**
   - Permite autenticação com a conta do Cidadão Gov.br, possibilitando a validação instantânea de prescrições médicas digitais assinadas com certificado ICP-Brasil.

---

## 🛒 Carrinho, Checkout e Métodos de Pagamento

```
[Cliente escolhe produtos]
          │
          ▼
[Gaveta Lateral CartDrawer]
  ├── Barra progressiva: Frete Grátis Turbo (R$ 99,00)
  ├── Checkbox para compra fracionada de itens
  └── Botão destacado: [Finalizar Compra • Ir para Pagamento]
          │
          ▼
[Tela de Checkout DesktopCheckoutPage]
  ├── 1. Identificação do Endereço (CEP com busca e taxa)
  ├── 2. Modalidade: Turbo Express 45min, Econômica ou Clique & Retire
  ├── 3. Validação de Receita (Upload ou apresentação na entrega)
  ├── 4. Cupom de Desconto (BEMVINDO15, TURBO10, SEMPREBEM)
  ├── 5. Escolha da Forma de Pagamento:
  │      ├─ Pix à Vista (5% OFF + QR Code instantâneo)
  │      ├─ Cartão de Crédito (Detecção de bandeira + até 6x s/ juros)
  │      ├─ Boleto Bancário (Código de barras para pagamento)
  │      └─ Convênio PBM Corporativo
  └── 6. Conclusão: Confirmação com protocolo oficial (FV-XXXXXX)
```

---

## 📷 Câmera, Leitura de Receitas e OCR

A solução de visão computacional e OCR da farmácia opera em duas frentes:
1. **Identificação de Embalagens:**
   - Captura o frame da webcam com proporção otimizada.
   - Extrai o nome do medicamento, dosagem e laboratório.
   - Realiza busca semântica na base e sugere genéricos com até 95% de desconto.
2. **Prescrição Médica e Retenção:**
   - Armazena a imagem da receita no cofre criptografado do cliente (`/camera/capture`).
   - Bloqueia a dispensa de medicamentos sob controle especial se nenhuma receita for anexada.

---

## 📁 Estrutura Completa de Pastas

```text
PagueMenos/ (Raiz do Projeto)
├── index.html                       # HTML principal da aplicação React
├── package.json                     # Dependências do frontend e scripts npm
├── vite.config.js                   # Configuração do Vite 8 com proxy reverso /api
├── .env.example                     # Modelo de variáveis de ambiente do front
├── .oxlintrc.json                   # Configuração do linter oxlint (Rust)
├── start.bat                        # Inicialização automática Windows (Batch)
├── start.ps1                        # Inicialização automática Windows (PowerShell)
├── start.sh                         # Inicialização automática Linux/macOS (Bash)
├── start_backend.bat / .sh          # Scripts para inicializar apenas o backend
├── start_frontend.bat / .sh         # Scripts para inicializar apenas o frontend
├── TUTORIAL_INICIALIZACAO.md        # Guia ilustrado passo a passo de deploy local
├── README.md                        # Documentação completa técnica e funcional
│
├── public/                          # Ativos estáticos públicos
│   ├── paguemenos-logo.png          # Logotipo oficial Pague Menos
│   ├── favicon.svg, icons.svg       # Favicons e vetores gráficos
│   └── products/                    # Imagens oficiais dos produtos e placeholder neutro
│
└── src/                             # Código-fonte do Frontend
    ├── main.jsx                     # Ponto de entrada React 19
    ├── App.jsx                      # Orquestrador de rotas, estados globais e drawers
    ├── index.css, App.css           # Design system e tokens de cores da Pague Menos
    ├── services/
    │   ├── api.js                   # Cliente HTTP REST com tratamento de erros e normalização
    │   ├── authService.js           # Gerenciador de autenticação, login e sessões
    │   ├── aiCommerceEngine.js      # Motor híbrido de IA (RAG local + remoto)
    │   └── imageAnalysisService.js  # Análise de imagem e simulação inteligente de OCR
    ├── data/
    │   ├── intentPresets.js         # Gatilhos de intenção rápida e jornadas de sintomas
    │   └── catalog.js               # Catálogo desacoplado para contingência
    └── components/
        ├── Header.jsx               # Header desktop com busca preditiva e seletor de CEP
        ├── Footer.jsx               # Rodapé com dados corporativos, CRF e selos
        ├── DesktopHomePage.jsx      # Página inicial desktop rica em conteúdo
        ├── DesktopAiResponsePage.jsx# Resposta dedicada da IA com filtros farmacêuticos
        ├── DesktopAuthPage.jsx      # Tela cheia de login/cadastro fixa edge-to-edge
        ├── DesktopCheckoutPage.jsx  # Tela de checkout completa com pagamentos
        ├── CartDrawer.jsx           # Gaveta slide-over com botão de finalizar compra
        ├── ChatbotWidget.jsx        # Assistente farmacêutica Sofia 24 horas
        ├── CameraCaptureModal.jsx   # Scanner de receitas e embalagens via webcam
        ├── UserProfilePage.jsx      # Área do cliente, cofre de receitas e pedidos
        ├── TraditionalCatalog.jsx   # Listagem tradicional de produtos com filtros
        ├── SafetyModal.jsx          # Modal de transparência regulatória ANVISA
        ├── SiteNavigationModals.jsx # Modais de lojas, app, ajuda e cálculo de CEP
        └── AiGuidedExperience.jsx   # Interface de compra guiada responsiva
```

---

## 🧰 Stack Técnica e Matriz de Dependências

### Frontend
| Pacote / Recurso | Versão | Função na Aplicação |
| :-- | :-- | :-- |
| **React** | `^19.0.0` | Biblioteca de componentes de interface com Concurrent Rendering. |
| **Vite** | `^8.0.0` | Bundler e servidor de desenvolvimento com Hot Module Replacement. |
| **lucide-react** | `^0.460.0` | Conjunto de ícones vetoriais modernos e consistentes. |
| **canvas-confetti** | `^1.9.3` | Efeito visual de celebração na aprovação do pedido de compra. |
| **oxlint** | `^0.15.0` | Linter estático baseado em Rust para máxima velocidade de análise. |
| **Vanilla CSS** | — | Estilização nativa com variáveis CSS, sem sobrecarga de frameworks utilitários. |

### Backend
| Pacote / Recurso | Versão | Função na Aplicação |
| :-- | :-- | :-- |
| **FastAPI** | `^0.115.0` | Framework web assíncrono de alta performance para APIs REST. |
| **Uvicorn** | `^0.34.0` | Servidor web ASGI assíncrono. |
| **Pydantic / Settings**| `^2.10.0` | Validação de dados, tipagem estrita e gestão de variáveis `.env`. |
| **PyArrow / Pandas** | `^18.0.0` | Leitura ultrarrápida do catálogo colunar em formato Parquet. |
| **Scikit-Learn** | `^1.6.0` | Vetorização TF-IDF e cálculo de similaridade de cosseno. |
| **Sentence-Transformers** | `^3.3.0` | Embeddings neurais densos para busca semântica profunda. |
| **OpenAI Python SDK** | `^1.55.0` | Integração com o modelo `gpt-4o-mini` para redação de respostas. |
| **Pytest / HTTPX** | `^8.3.0` | Testes automatizados unitários e de integração de rotas. |

---

## 🔐 Variáveis de Ambiente (.env)

### Backend (`back_PagueMenos/PagueMenosBackend/.env`)
```bash
# Habilita ou desabilita o modelo de linguagem externo
# Se 'false', o sistema utiliza o motor determinístico seguro de fallback
LLM_ENABLED=false

# Chave de API da OpenAI (necessária apenas se LLM_ENABLED=true)
OPENAI_API_KEY=sua_chave_aqui

# Modelo utilizado para redação
LLM_MODEL=gpt-4o-mini

# Backend de Embeddings para o RAG: 'auto', 'sentence' ou 'tfidf'
# Recomendado 'tfidf' para inicialização instantânea sem necessidade de baixar PyTorch
EMBEDDING_BACKEND=tfidf

# Origens autorizadas para CORS (separadas por vírgula)
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://programa-pague-menos.vercel.app

# Caminho do arquivo de catálogo Parquet
CATALOG_PATH=data/paguemenos_catalog.parquet

# Nível de logging
LOG_LEVEL=info
```

### Frontend (`PagueMenos/.env`)
```bash
# Em desenvolvimento, mantenha vazio para utilizar o proxy do Vite (/api)
# Em produção, aponte para a URL do seu backend no Render ou Railway
VITE_API_URL=
```

---

## 🧪 Testes, Qualidade e Smoke Tests

### Testes Automatizados no Backend (Pytest)
```bash
cd back_PagueMenos/PagueMenosBackend
pytest -v
```
A suíte de testes valida:
- Bloqueio determinístico da Camada 1 contra pedidos de dosagem infantil e diagnóstico.
- Purga de medicamentos controlados sob retenção de receita na Camada 2.
- Acurácia da busca vetorial RAG sobre o catálogo Parquet de 500 produtos.
- Bloqueio anti-alucinação contra divergências de preço e SKUs fictícios.
- Fluxos completos de autenticação, adição ao carrinho e checkout.

### Smoke Tests Rápidos via Terminal (cURL)
```bash
# 1. Testar bloqueio de dosagem (ANVISA - Camada 1)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"smoke-1\",\"message\":\"qual a dosagem recomendada de dipirona infantil?\"}"

# 2. Testar busca segura por sintoma de dor de cabeça
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"smoke-2\",\"message\":\"estou com dor de cabeca e febre\"}"

# 3. Consultar saúde da API e status do catálogo
curl http://localhost:8000/health
```

---

## 🚀 Deploy em Produção (Vercel + Render / Docker)

### 1. Backend no Render
1. Crie um novo **Web Service** no [Render](https://render.com).
2. Conecte o repositório e aponte para o diretório `back_PagueMenos/PagueMenosBackend`.
3. Defina o Runtime como **Python 3**.
4. Comando de build: `pip install -r requirements.txt`.
5. Comando de start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Configure as variáveis de ambiente (`EMBEDDING_BACKEND=tfidf`, `LLM_ENABLED=false`, `CORS_ORIGINS=https://sua-url-vercel.vercel.app`).

### 2. Frontend na Vercel
1. Importe o repositório na [Vercel](https://vercel.com).
2. Defina o Root Directory como `PagueMenos`.
3. Adicione a variável de ambiente:
   - `VITE_API_URL` = `https://seu-backend-paguemenos.onrender.com`
4. Execute o Deploy.

### 3. Backend via Container Docker
```bash
cd back_PagueMenos/PagueMenosBackend
docker build -t paguemenos-backend .
docker run -d -p 8000:8000 --name paguemenos-api paguemenos-backend
```

---

## 🛡️ Segurança, Compliance Regulatório e LGPD

1. **RDC 20/2011 e RDC 44/2009 da ANVISA:**
   - Proibição absoluta de venda desassistida de medicamentos sob controle especial (tarjas pretas e vermelhas com retenção).
   - Nenhum produto tarjado tem sua compra concluída sem validação física ou digital de receita médica assinada por profissional com CRM ativo.
2. **Proteção de Dados (LGPD — Lei 13.709/2018):**
   - A navegação, busca de sintomas e conversas com a IA são 100% anônimas por padrão, atreladas a UUIDs temporários de sessão.
   - Dados de saúde e dados cadastrais são tratados de forma dissociada, com consentimento expresso e possibilidade de exclusão a qualquer momento.
3. **Segurança de Pagamentos:**
   - Criptografia SSL/TLS em todas as conexões.
   - Nenhum dado crítico de cartão de crédito (como o código CVV) é gravado em logs ou em arquivos do servidor.

---

## ❓ FAQ e Solução de Problemas

### 1. O frontend exibe que o backend está offline
- Certifique-se de que o backend está rodando na porta `8000`. Acesse `http://localhost:8000/health` no navegador para verificar.
- Caso o backend esteja desligado, o frontend continuará funcionando em **modo de contingência**, utilizando os dados em cache e os motores locais.

### 2. A porta 8000 ou 5173 já está em uso
- No Windows: `netstat -ano | findstr :8000` seguido de `taskkill /PID <PID> /F`.
- No Linux/macOS: `lsof -i :8000` seguido de `kill -9 <PID>`.

### 3. Erro de download do modelo de embeddings
- Se sua conexão com a internet oscilar no primeiro download do `sentence-transformers`, configure `EMBEDDING_BACKEND=tfidf` no arquivo `.env`. O motor TF-IDF sobe instantaneamente sem baixar pesos de rede neural.

---

## 📄 Licença e Créditos

Desenvolvido para o **Hacka Business REC'n'Play 2026 — Desafio Pague Menos**.  
Uso educacional, demonstrativo e de prototipação de soluções de IA para comércio farmacêutico com rigor regulatório.