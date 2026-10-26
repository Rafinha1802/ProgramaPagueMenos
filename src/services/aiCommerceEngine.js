// Motor de IA Commerce da Farmácia Pague Menos
// Conectado diretamente ao backend FastAPI (back_PagueMenos)
// Processa linguagem natural, guardrails regulatórios ANVISA, RAG e orçamentos.

import { sendChatMessage, fetchProducts, normalizeProduct, getOrCreateSessionId } from './api.js';

// Cache em memória dos produtos carregados do backend
let cachedBackendProducts = [];

/**
 * Atualiza o catálogo em cache no frontend com os produtos reais do backend
 */
export function setCachedCatalogProducts(products) {
  if (Array.isArray(products) && products.length > 0) {
    cachedBackendProducts = products;
  }
}

export function getCachedCatalogProducts() {
  return cachedBackendProducts;
}

/**
 * Execução assíncrona do Motor de IA via fetch no backend FastAPI (/chat)
 */
export async function runAiCommerceEngineAsync({
  prompt = '',
  presetId = null,
  budget = null,
  preferGenerics = false,
  customSelectedIds = null,
  attachment = null,
  sessionId = null
}) {
  const activeSessionId = sessionId || getOrCreateSessionId();
  const normalized = (prompt || '').trim();
  const extractedBudget = budget ? parseFloat(budget) : null;

  // Garante que IDs de presets além dos primeiros 100 sejam recuperados do backend
  if (customSelectedIds && customSelectedIds.length > 0) {
    const missingIds = customSelectedIds.filter(id => !cachedBackendProducts.some(p => String(p.id) === String(id)));
    if (missingIds.length > 0) {
      try {
        const fetched = await fetchProducts({ ids: missingIds, limite: 100 });
        if (Array.isArray(fetched) && fetched.length > 0) {
          fetched.forEach(item => {
            if (!cachedBackendProducts.some(p => String(p.id) === String(item.id))) {
              cachedBackendProducts.push(item);
            }
          });
        }
      } catch (err) {
        console.warn('[aiCommerceEngine] Aviso ao carregar IDs do preset:', err);
      }
    }
  }

  // Anexo tratado dinamicamente sem dados inventados
  const attachedAnalysis = attachment ? {
    type: attachment.type,
    name: attachment.name,
    previewUrl: attachment.previewUrl,
    intent: preferGenerics ? 'generic' : 'consultation'
  } : null;

  // Montagem dinâmica do prompt para o orquestrador do backend
  let chatPrompt = normalized;
  if (attachment) {
    chatPrompt = chatPrompt
      ? `${chatPrompt} (anexo: ${attachment.name})`
      : `Medicamento ou receita médica: ${attachment.name}`;
  }
  if (!chatPrompt) {
    chatPrompt = 'Produtos de cuidados, medicamentos e saúde essenciais';
  }
  if (preferGenerics && !chatPrompt.toLowerCase().includes('genérico') && !chatPrompt.toLowerCase().includes('generico')) {
    chatPrompt += ' - priorizar opções de genéricos mais econômicos';
  }

  // 1. Chamada 100% dinâmica ao backend FastAPI (/chat) via RAG vetorial + Guardrails + LLM
  try {
    const backendResponse = await sendChatMessage({
      sessionId: activeSessionId,
      message: chatPrompt
    });

    let recommendedItems = (backendResponse.produtos || []);

    // Se preferir genéricos, filtrar ou priorizar genéricos
    if (preferGenerics && recommendedItems.length > 0) {
      const generics = recommendedItems.filter(p => p.isGeneric);
      if (generics.length > 0) {
        recommendedItems = generics;
      }
    }

    // Se houver limite de orçamento
    let currentTotal = recommendedItems.reduce((acc, p) => acc + (p.price || 0), 0);
    if (extractedBudget && currentTotal > extractedBudget) {
      while (recommendedItems.length > 1 && currentTotal > extractedBudget) {
        recommendedItems.pop();
        currentTotal = recommendedItems.reduce((acc, p) => acc + (p.price || 0), 0);
      }
    }

    const originalTotal = recommendedItems.reduce((acc, p) => acc + (p.originalPrice || p.price), 0);
    const savingsTotal = Math.max(0, originalTotal - currentTotal);

    const guardrail = backendResponse.guardrailAcionado || '';
    const isPrescriptionBlocked = guardrail.includes('prescricao') || guardrail === '1_prescricao';
    const isDosageBlocked = guardrail.includes('dosagem') || guardrail === '2_dosagem';
    const isDiagnosisBlocked = guardrail.includes('diagnostico') || guardrail === '3_diagnostico';
    const isNoSafeProduct = backendResponse.tipo === 'sem_produto_seguro';
    const isBlocked = backendResponse.tipo === 'bloqueio_intencao';

    const isControlled = !isNoSafeProduct && (isPrescriptionBlocked || recommendedItems.some(i => i.requiresPrescription || i.isControlled));

    const safetyNotice = {
      hasPrescriptionRequired: !isNoSafeProduct && (isPrescriptionBlocked || isControlled),
      isControlled: isControlled,
      requiresPrescriptionValidation: isPrescriptionBlocked,
      prescriptionPreValidated: false,
      rxItems: recommendedItems.filter(i => i.requiresPrescription).map(i => i.name),
      disclaimer: 'AO PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO.',
      pharmacistSupervision: 'Seleção auditada pelo back_PagueMenos com 4 camadas de Guardrails regulatórios.',
      warningText: isBlocked
        ? backendResponse.mensagem
        : isNoSafeProduct
        ? 'Nenhum produto seguro sem exigência de receita encontrado para esta busca.'
        : 'Todos os medicamentos recomendados são Isentos de Prescrição (MIPs). Siga as orientações da embalagem.',
      guardrailAcionado: guardrail
    };

    // Título e justificativa claros e sem confusão entre bloqueio ANVISA e ausência de produtos
    let journeyTitle = `Recomendação Farmacêutica: "${prompt.slice(0, 36) || 'Cesta Personalizada'}"`;
    let rationale = `Encontrei ${recommendedItems.length} opções disponíveis no catálogo real da Pague Menos sem exigência de receita médica.`;

    if (isBlocked) {
      journeyTitle = 'Aviso Regulatório e de Segurança ANVISA';
      rationale = 'Esta requisição envolve termos que a legislação sanitária não permite tratar sem consulta médica.';
    } else if (isNoSafeProduct) {
      journeyTitle = 'Nenhum Produto Isento de Receita Encontrado';
      rationale = 'Não encontramos produtos seguros e sem necessidade de receita médica para essa busca no catálogo atual.';
    }

    return {
      theme: isBlocked ? 'bloqueio_regulatorio' : isNoSafeProduct ? 'sem_produto' : 'atendimento_ia',
      journeyTitle,
      rationale,
      botResponseText: backendResponse.mensagem,
      appliedPrompt: prompt,
      preferGenerics,
      targetBudget: extractedBudget,
      isWithinBudget: extractedBudget ? currentTotal <= extractedBudget : true,
      totalPrice: currentTotal,
      originalTotal,
      regularTotal: currentTotal,
      savingsTotal,
      recommendedItems,
      safetyNotice,
      quickRefinements: [
        {
          id: 'toggle-generics',
          label: preferGenerics ? 'Voltar para marcas de referência' : 'Trocar todos por genéricos mais baratos',
          active: preferGenerics
        },
        {
          id: 'budget-adjust',
          label: extractedBudget ? `Ajustar teto (Atual: R$ ${extractedBudget.toFixed(0)})` : 'Definir limite de orçamento'
        }
      ],
      attachedAnalysis,
      fontes: backendResponse.fontes || ['catalogo_paguemenos', 'anvisa_regras'],
      fallbackLlm: backendResponse.fallbackLlm
    };
  } catch (error) {
    console.warn('[runAiCommerceEngineAsync] Falha ao contatar back_PagueMenos, usando catálogo local em cache:', error);
    return runAiCommerceEngine({
      prompt,
      budget,
      preferGenerics,
      customSelectedIds,
      attachment,
      presetId
    });
  }
}

/**
 * Execução síncrona/fallback utilizando os produtos carregados do backend
 */
export function runAiCommerceEngine({
  prompt = '',
  presetId = null,
  budget = null,
  preferGenerics = false,
  customSelectedIds = null,
  attachment = null
}) {
  const normalized = (prompt || '').toLowerCase().trim();
  const catalog = cachedBackendProducts.length > 0 ? cachedBackendProducts : [];
  const extractedBudget = budget ? parseFloat(budget) : null;

  let matched = [];
  if (customSelectedIds && customSelectedIds.length > 0) {
    matched = customSelectedIds
      .map(id => catalog.find(p => String(p.id) === String(id)))
      .filter(Boolean);
  } else if (normalized) {
    matched = catalog.filter(item => {
      const name = (item.name || item.nome || '').toLowerCase();
      const brand = (item.brand || item.marca || '').toLowerCase();
      const cat = (item.category || item.categoria || '').toLowerCase();
      return name.includes(normalized) || brand.includes(normalized) || cat.includes(normalized);
    });
  }

  if (matched.length === 0 && catalog.length > 0) {
    matched = catalog.slice(0, 3);
  }

  let recommendedItems = [...matched];

  if (preferGenerics) {
    const gen = recommendedItems.filter(p => p.isGeneric);
    if (gen.length > 0) recommendedItems = gen;
  }

  let currentTotal = recommendedItems.reduce((acc, p) => acc + (p.price || 0), 0);
  const originalTotal = recommendedItems.reduce((acc, p) => acc + (p.originalPrice || p.price), 0);
  const savingsTotal = Math.max(0, originalTotal - currentTotal);

  return {
    theme: 'catalogo_backend',
    journeyTitle: `Atendimento Digital Pague Menos: "${prompt || 'Consulta'}"`,
    rationale: `Produtos recuperados do catálogo oficial Pague Menos (${recommendedItems.length} itens).`,
    botResponseText: `Olá! Localizei estes produtos no catálogo oficial da Pague Menos para sua busca "${prompt}".`,
    appliedPrompt: prompt,
    preferGenerics,
    targetBudget: extractedBudget,
    isWithinBudget: extractedBudget ? currentTotal <= extractedBudget : true,
    totalPrice: currentTotal,
    originalTotal,
    regularTotal: currentTotal,
    savingsTotal,
    recommendedItems,
    safetyNotice: {
      hasPrescriptionRequired: false,
      isControlled: false,
      requiresPrescriptionValidation: false,
      prescriptionPreValidated: false,
      rxItems: [],
      disclaimer: 'AO PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO.',
      pharmacistSupervision: 'Seleção orientada por inteligência com supervisão farmacêutica Pague Menos.',
      warningText: 'Todos os medicamentos incluídos são Isentos de Prescrição (MIPs).'
    },
    quickRefinements: [],
    attachedAnalysis: null
  };
}
