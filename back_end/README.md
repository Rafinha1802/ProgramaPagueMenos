# PagueMenosBackend
<div align="center">

# 🏥 Pague Menos IA Commerce — Backend

### Da intenção em linguagem natural à compra — sem alucinar no preço.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Tests](https://img.shields.io/badge/tests-20%20passing-brightgreen)](./tests)
[![License](https://img.shields.io/badge/license-Private-red)](#-licença-e-confidencialidade)
[![Status](https://img.shields.io/badge/status-MVP%20funcional-blue)](#-status-do-projeto)

[Visão Geral](#-visão-geral) ·
[Arquitetura](#-arquitetura) ·
[Como Rodar](#-como-rodar) ·
[Endpoints](#-endpoints) ·
[Guardrails](#-guardrails-determinísticos) ·
[Deploy](#-deploy) ·
[Roadmap](#-roadmap-e-limitações)

</div>

---

## 🎯 Visão Geral

Este repositório contém o **backend do assistente conversacional** da Pague Menos
para o desafio **IA Commerce · Hacka Business REC'n'Play 2026**.

O backend recebe uma mensagem em linguagem natural, aplica **quatro camadas
determinísticas de guardrail** (Anvisa + estoque + validação de LLM), consulta
o catálogo via **RAG vetorial** e devolve produtos prontos para o carrinho — ou
um aviso regulatório quando o tema **não pode** ser tratado por IA.

> **Regra inegociável do produto:**
> O LLM **não decide** se é seguro. Quem decide são funções puras, auditáveis,
> testáveis em milissegundos. Se qualquer camada bloqueia, a resposta é bloqueada.

### O que o backend **faz**

- ✅ Interpreta a intenção do usuário em português coloquial
- ✅ Bloqueia diagnóstico, dosagem, prescrição e substituição de receita
- ✅ Filtra produtos com `is_prescription=True` (Anvisa)
- ✅ Filtra produtos indisponíveis em estoque
- ✅ Recupera produtos via similaridade de cosseno (RAG)
- ✅ Valida a resposta do LLM contra os fatos recuperados (anti-alucinação)
- ✅ Devolve carrinho e checkout simulado prontos para o frontend

### O que o backend **não faz** (por design)

- ❌ Não diagnostica
- ❌ Não prescreve
- ❌ Não orienta dosagem
- ❌ Não substitui consulta médica
- ❌ Não vende medicamento com receita por este canal

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Stack Técnica](#-stack-técnica)
- [Como Rodar](#-como-rodar)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints](#-endpoints)
- [Guardrails Determinísticos](#-guardrails-determinísticos)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Roadmap e Limitações](#-roadmap-e-limitações)
- [Decisões de Arquitetura](#-decisões-de-arquitetura)
- [Time](#-time)
- [Licença e Confidencialidade](#-licença-e-confidencialidade)

---

## 🏗️ Arquitetura

O backend segue **Clean Architecture em camadas horizontais**, com dependências
apontando **sempre para dentro** (o core não conhece HTTP, o HTTP não conhece
o banco).

```
┌──────────────────────────────────────────────────────────────┐
│                     REACT (frontend separado)                │
│  Chat → Recomendação → Produto → Carrinho → Checkout         │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP/JSON (REST)
┌──────────────────────────────▼───────────────────────────────┐
│                     FASTAPI (este repositório)               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  API Layer (app/api/)                                  │  │
│  │  routes_chat · routes_products · routes_cart ·         │  │
│  │  routes_checkout · routes_audit                        │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │                                   │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │  Service Layer (app/services/)                         │  │
│  │  OrquestradorIA — único ponto que conhece todas as     │  │
│  │  camadas de guardrail, RAG e LLM                       │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │                                   │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │  Core Layer (app/core/)                                │  │
│  │  guardrails · rag_engine · llm_agent · text_utils      │  │
│  │  ← funções puras, testáveis, sem estado                │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │                                   │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │  Repository Layer (app/repositories/)                  │  │
│  │  product_repo (parquet) · cart_repo (memory)           │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│  DADOS (parquet → PostgreSQL + pgvector no roadmap)          │
└──────────────────────────────────────────────────────────────┘
```

### Fluxo de uma requisição `/chat`

```
Query do usuário
       │
       ▼
┌─────────────────┐
│ Camada 1        │──► BLOQUEIA ──► Aviso Anvisa (fim)
│ Intenção        │
└────────┬────────┘
         │ passa
         ▼
┌─────────────────┐
│ RAG vetorial    │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Camada 2 + 3    │──► FILTRA receita e estoque
└────────┬────────┘
         │ sobram N produtos seguros
         ▼
┌─────────────────┐
│ Camada 4        │──► LLM gera → validador aprova/rejeita
│ Validação LLM   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
 aprovou   rejeitou
    │         │
    ▼         ▼
resposta   fallback
  LLM    determinístico
```

---

## 🧰 Stack Técnica

| Camada | Tecnologia | Por quê |
|---|---|---|
| **Framework** | FastAPI 0.115 | Async nativo, tipagem Pydantic, docs Swagger automáticas |
| **Servidor** | Uvicorn | ASGI, suporta workers, roda no Render |
| **Validação** | Pydantic v2 | Contratos tipados, geração automática de JSON Schema |
| **RAG** | sentence-transformers (`all-MiniLM-L6-v2`) | Embeddings semânticos, roda em CPU |
| **Fallback RAG** | TF-IDF (scikit-learn) | Se o modelo não puder ser baixado, o servidor **ainda sobe** |
| **LLM** | OpenAI (`gpt-4o-mini`) | Custo baixo, latência boa, trocável via env |
| **Dados** | Apache Parquet (pyarrow) | 10x menor que CSV, tipos preservados |
| **Testes** | pytest + httpx | Cobertura das 4 camadas de guardrail |
| **Deploy** | Render (backend) + Vercel (frontend) | Free tier suficiente para o MVP |

---

## 🚀 Como Rodar

### Pré-requisitos

- Python 3.11+ (recomendado 3.12)
- Git
- ~2 GB livres em disco (torch + sentence-transformers)

### Inicialização Automática (1 Clique) ⚡

O repositório inclui scripts inteligentes que detectam o ambiente, criam o ambiente virtual (`.venv`), **instalam automaticamente todas as dependências de `requirements.txt`** e sobem o servidor FastAPI:

- **No Windows:** Dê dois cliques em [`start.bat`](./start.bat) ou execute no PowerShell:
  ```powershell
  .\start.ps1
  ```
- **No Linux / macOS:**
  ```bash
  chmod +x start_backend.sh
  ./start_backend.sh
  ```

---

### Setup manual (Passo a Passo)

```bash
# 1. Clonar
git clone https://github.com/Accenture-Avanade-RECnPlay/PagueMenosBackend.git
cd PagueMenosBackend

# 2. Ambiente virtual
python -m venv .venv
source .venv/bin/activate          # Linux/macOS
# .venv\Scripts\activate           # Windows

# 3. Dependências
pip install -r requirements.txt

# 4. Variáveis de ambiente
cp .env.example .env
# edite .env (veja a seção abaixo)

# 5. Subir o servidor
uvicorn app.main:app --reload --port 8000
```

Acesse:

- **API:** http://localhost:8000
- **Swagger:** http://localhost:8000/docs
- **Health:** http://localhost:8000/health
- **Frontend Vite (desenvolvimento):** http://localhost:5173

### Teste rápido

```bash
# Bloqueio da camada 1
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"teste","message":"me receite um antibiótico"}'

# Busca segura
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"teste","message":"soro fisiológico"}'
```

---

## 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha. **Nunca** commite o `.env` real.

| Variável | Padrão | Descrição |
|---|---|---|
| `OPENAI_API_KEY` | `(vazio)` | Chave OpenAI (opcional) |
| `LLM_ENABLED` | `false` | `true` liga o LLM real; `false` usa fallback determinístico |
| `LLM_MODEL` | `gpt-4o-mini` | Modelo OpenAI |
| `CORS_ORIGINS` | `http://localhost:5173,https://programa-pague-menos.vercel.app` | Origens permitidas, separadas por vírgula; inclui o Vite local e o frontend publicado no Vercel |
| `CATALOG_PATH` | `data/paguemenos_catalog.parquet` | Caminho do catálogo |
| `EMBEDDING_BACKEND` | `auto` | `auto` / `tfidf` / `sentence` |
| `LOG_LEVEL` | `info` | Nível de log |

> 💡 **Recomendação para a demo:** `LLM_ENABLED=false`.
> O MVP funciona inteiro sem LLM, e a demonstração **não depende**
> de a OpenAI estar de pé.

---

## 🌐 Endpoints

| Método | Rota | Descrição | Códigos |
|---|---|---|---|
| `POST` | `/chat` | Orquestrador com 4 camadas | `200`, `500` |
| `GET` | `/products` | Lista catálogo com filtros | `200` |
| `GET` | `/products/{id}` | Detalhe do produto | `200`, `404` |
| `POST` | `/cart/items` | Adiciona ao carrinho | `200`, `400`, `403`, `404` |
| `GET` | `/cart` | Consulta carrinho por sessão | `200` |
| `POST` | `/checkout` | Simula pagamento | `200`, `400` |
| `GET` | `/audit/readiness` | Relatório de prontidão | `200`, `404` |
| `GET` | `/health` | Status do servidor | `200` |

### Contrato do `/chat`

**Request:**
```json
{
  "session_id": "uuid-anonimo",
  "message": "soro fisiológico"
}
```

**Response `200` (produto):**
```json
{
  "tipo": "produto",
  "mensagem": "Encontrei estes produtos...",
  "produtos": [
    {
      "product_id": "46533",
      "nome": "Solução Fisiológica Dauf Pro Soro 0,9% 500ml",
      "marca": "Dauf",
      "preco": 8.99,
      "disponivel": true,
      "categoria": "Higiene e Beleza/Soluções",
      "motivo_recomendacao": "Disponível e sem exigência de receita."
    }
  ],
  "guardrail_acionado": null,
  "fontes": ["catalogo_paguemenos", "anvisa_regras"],
  "fallback_llm": true
}
```

**Response `200` (bloqueio):**
```json
{
  "tipo": "bloqueio_intencao",
  "mensagem": "⚠️ Aviso Regulatório (Anvisa...)...",
  "produtos": [],
  "guardrail_acionado": "1_prescricao",
  "fontes": [],
  "fallback_llm": false
}
```

**Response `200` (sem produto seguro):**
```json
{
  "tipo": "sem_produto_seguro",
  "mensagem": "Não encontrei produto seguro...",
  "produtos": [],
  "guardrail_acionado": "2_ou_3",
  "fontes": [],
  "fallback_llm": false
}
```

---

## 🛡️ Guardrails Determinísticos

O coração do projeto. **Nenhuma camada é o LLM.**

| # | Camada | Função | O que protege | Teste |
|---|---|---|---|---|
| 1 | **Intenção** | `camada_1_intencao()` | Diagnóstico, dosagem, prescrição, gravidez, substituição | `test_guardrails.py` |
| 2 | **Conteúdo** | `camada_2_conteudo()` | Produto com `is_prescription=True` | `test_guardrails.py` |
| 3 | **Estoque** | `camada_3_estoque()` | Produto indisponível | `test_guardrails.py` |
| 4 | **Validação LLM** | `SafeLLMAgent._validate()` | Preço alucinado, ID inventado, palavra proibida | `test_llm_agent.py` |

### Regra inegociável

> Se qualquer camada bloqueia, **a resposta é bloqueada**.
> Nenhuma camada pode ser desligada em produção.
> Nenhum LLM tem poder de veto.

Toda resposta bloqueada inclui a frase obrigatória:

> **AO PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO.**

### Feature engineering de receita

A coluna `is_prescription` é gerada por regras auditáveis em `app/core/guardrails.py`:

| Sinal | Peso |
|---|---|
| Categoria contém `Antibiótico` | forte |
| Categoria contém `Controlado` | forte |
| Descrição contém `sob prescrição` / `receita obrigatória` | forte |
| Descrição contém `tarja preta` / `tarja vermelha` | forte |
| Categoria contém `Medicamentos` | fraco (só conta se combinado) |

**Falso positivo é aceitável. Falso negativo não é.**

---

## 🧪 Testes

```bash
pytest -v
```

**20 testes** cobrindo as 4 camadas:

```
tests/test_guardrails.py::test_bloqueia_diagnostico PASSED
tests/test_guardrails.py::test_bloqueia_dosagem PASSED
tests/test_guardrails.py::test_bloqueia_prescricao PASSED
tests/test_guardrails.py::test_libera_busca_produto PASSED
tests/test_guardrails.py::test_bloqueia_produto_receita PASSED
tests/test_guardrails.py::test_libera_produto_sem_receita PASSED
tests/test_guardrails.py::test_bloqueia_sem_estoque PASSED
tests/test_guardrails.py::test_libera_com_estoque PASSED
tests/test_rag.py::test_busca_soro PASSED
tests/test_rag.py::test_score_decrescente PASSED
tests/test_llm_agent.py::test_aceita_resposta_honesta PASSED
tests/test_llm_agent.py::test_rejeita_preco_alucinado PASSED
tests/test_llm_agent.py::test_rejeita_id_inventado PASSED
tests/test_llm_agent.py::test_rejeita_dosagem PASSED
tests/test_llm_agent.py::test_fallback_quando_llm_desligado PASSED
tests/test_api.py::test_health_ok PASSED
tests/test_api.py::test_chat_bloqueia_intencao[...] PASSED (5x)
tests/test_api.py::test_chat_busca_segura PASSED
tests/test_api.py::test_lista_produtos PASSED
tests/test_api.py::test_checkout_fluxo_completo PASSED
```

### Cobertura

```bash
pip install pytest-cov
pytest --cov=app --cov-report=term-missing
```

### Cenários críticos (do PDF do orientador Avanade)

| Cenário | Entrada | Comportamento esperado |
|---|---|---|
| Pedido comum | `"soro fisiológico"` | Produtos seguros |
| Pedido ambíguo | `"dor"` | Pede esclarecimento ou retorna genéricos seguros |
| Medicamento | `"amoxicilina"` | Filtra por `is_prescription` |
| Contraindicação | `"posso tomar grávida?"` | Bloqueio camada 1 |
| Sem resultado | `"cadeira ergonômica"` | `tipo: "sem_produto_seguro"` |
| Falha do LLM | simular timeout | Fallback determinístico |

---

## ☁️ Deploy

### Backend → Render

1. **New → Web Service** (ou **Docker** se preferir o `Dockerfile`)
2. Conecte o repositório
3. **Root Directory:** `backend` (ou raiz, se este repo for só backend)
4. **Build:** `pip install -r requirements.txt`
5. **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. **Env vars:**
   - `OPENAI_API_KEY` = (opcional, só se `LLM_ENABLED=true`)
   - `LLM_ENABLED` = `false`
   - `CORS_ORIGINS` = `http://localhost:5173,https://programa-pague-menos.vercel.app`

> ⚠️ O plano free do Render hiberna após ~15 min de inatividade.
> Antes da demo, acesse `/health` para "acordar" o serviço.

### Frontend → Vercel

O frontend tem repositório próprio. Configure lá:

- `VITE_API_URL` = `https://seu-backend.onrender.com`

O backend permite as duas origens em `CORS_ORIGINS`: `http://localhost:5173`
para testes locais com Vite e `https://programa-pague-menos.vercel.app` para o
frontend publicado.

### Variáveis obrigatórias no deploy

| Variável | Onde | Exemplo |
|---|---|---|
| `LLM_ENABLED` | Render | `false` |
| `OPENAI_API_KEY` | Render | `sk-...` (só se `LLM_ENABLED=true`) |
| `CORS_ORIGINS` | Render | `http://localhost:5173,https://programa-pague-menos.vercel.app` |
| `VITE_API_URL` | Vercel | `https://seu-backend.onrender.com` |

---

## 🗺️ Roadmap e Limitações

Este é o **contrato de honestidade** do projeto. Os números vêm do arquivo
`dados/auditoria/prontidao_producao.json`, gerado na Estação 12 do notebook
de experimentação.

O JSON está incluído e rastreado neste repositório; se ele não estiver presente
em outro ambiente, gere-o novamente na Estação 12.

### Números medidos

| Métrica | Valor | Significado |
|---|---|---|
| Escape do guardrail léxico | **84%** | 21 de 25 paráfrases de risco não foram pegas por gatilho |
| Acerto do TF-IDF em sinônimo | **30%** | Busca por "dor de cabeça" não acha "analgésico" |
| Recomendações desatualizadas | **17,5%** | Sem revalidação em tempo real, quase 1 em 5 fica stale |
| Produtos com receita | **43 de 500** | 8,6% do catálogo exige receita |

### Limitações declaradas

| # | Limitação | Ação recomendada |
|---|---|---|
| 1 | Guardrail léxico escapa de paráfrase | Classificador semântico |
| 2 | Falso positivo em receita | Revisão humana de `suspeita=True` |
| 3 | TF-IDF não entende sinônimo | Embeddings reais ou dicionário |
| 4 | Catálogo é foto do momento | Revalidação em tempo real |

### Próximos passos técnicos

| Prioridade | Item | Impacto |
|---|---|---|
| 🔴 Alta | Classificador semântico de intenção | Fecha furo do guardrail léxico |
| 🔴 Alta | Revalidação de preço/estoque em tempo real | Evita venda de produto esgotado |
| 🟡 Média | Embeddings reais em produção | Busca por sinônimo |
| 🟡 Média | JWT + RBAC | Personalização por usuário |
| 🟡 Média | Filas assíncronas (ARQ/Celery) | Escala horizontal |
| 🟢 Baixa | PostgreSQL + pgvector | Persistência e escala |

### O que **não** está implementado (e por quê)

| Requisito sênior | Status | Justificativa |
|---|---|---|
| JWT + Refresh Token | ❌ Ausente | Jornada anônima por design; `session_id` sem PII |
| RBAC/ABAC | ❌ Ausente | Sem login, sem roles |
| Rate limiting | ❌ Ausente | Render free tem limite de 750h/mês |
| Filas assíncronas | ❌ Ausente | `/chat` responde em 2-3s |
| Observabilidade (OTel) | ❌ Ausente | Logs do Render são suficientes para o MVP |
| Auto-scaling | ❌ Ausente | Recurso de plano pago |
| SAST no CI | ❌ Ausente | Documentado como próximo passo |

> **A arquitetura permite adicionar tudo isso sem reescrever o core.**
> Os guardrails são funções puras. Funções puras não quebram quando você
> troca de provedor de LLM, de banco, de fila.

---

## 🧠 Decisões de Arquitetura

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| **FastAPI** | Flask | Async nativo, tipagem Pydantic, docs automáticas |
| **Guardrails determinísticos** | Guardrail via LLM | Anvisa exige regra auditável, não inferência |
| **RAG vetorial** | GraphRAG | Catálogo é relativamente independente; grafo não agrega no MVP |
| **Parquet** | CSV | 10x menor, tipos preservados, leitura mais rápida |
| **OpenAI `gpt-4o-mini`** | Modelo local | Custo baixo, latência boa; trocável via `LLM_MODEL` |
| **LLM desligado por padrão** | LLM sempre ligado | MVP funciona sem depender de API externa |
| **Carrinho em memória** | Redis | Simplicidade do MVP; interface permite trocar |
| **Repositórios separados (backend + frontend)** | Monorepo | Time dividido por frente; deploy independente |

### Premissas assumidas

1. **Não haverá envio de dados do cliente.** Toda base é pública ou sintética.
2. **Não há autenticação.** A jornada é anônima; `session_id` é UUID sem PII.
3. **O checkout é simulado.** Não há integração real com gateway de pagamento.
4. **O catálogo é uma foto.** Preço e estoque são do momento da coleta.
5. **A integração com a Pague Menos é via contrato.** Os endpoints Pydantic
   são o contrato; trocar parquet por PostgreSQL é 1 arquivo.

---

## 👥 Time

| Nome | Papel | Contato |
|---|---|---|
| Vitor Hugo Melo | UX | Não informado |
| Rafaella Guedes Barbosa | Frontend / UX | Não informado |
| Nadiveth Elena Duno Escalona | Dados / Backend / IA | [LinkedIn](https://www.linkedin.com/in/nadiduno/) |
| Leonardo Gomes de Moura | Frontend / UX | Não informado |

---

## 📄 Licença e Confidencialidade

Este projeto foi desenvolvido para o **Hacka Business · REC'n'Play 2026 ·
Pague Menos**.

O arquivo [`LICENSE`](./LICENSE) registra os termos de uso restrito. A presença
do arquivo não altera a visibilidade do repositório: confirme nas configurações
do GitHub que ele está privado.

- **Repositório privado.** É vedada a publicação do código, do enunciado
  ou de qualquer informação recebida.
- A propriedade intelectual do produto final pertence à **Pague Menos**,
  conforme o termo aceito na inscrição.
- O material é **confidencial** e não pode ser usado em portfólio,
  trabalho acadêmico ou processo seletivo.

**Repositório privado. Uso restrito aos participantes.**

---

<div align="center">

**Construído com honestidade, café e 20 testes verdes.**

`O LLM é um rascunhista. O validador é o revisor.`

</div>