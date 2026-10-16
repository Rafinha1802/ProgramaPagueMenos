// Motor de IA Commerce da Farmácia FarmaViva
// Converte linguagem natural e intenções de compra em seleções estruturadas do catálogo,
// aplicando regras clínicas de segurança, restrição orçamentária e otimização por genéricos.

import { CATALOG } from '../data/catalog';

export function runAiCommerceEngine({
  prompt = '',
  presetId = null,
  budget = null,
  preferGenerics = false,
  customSelectedIds = null,
  refinementAction = null
}) {
  const normalized = (prompt || '').toLowerCase().trim();

  // 1. Identificar intenção ou tema principal
  let theme = 'geral';
  let extractedBudget = budget ? parseFloat(budget) : null;

  // Extração inteligente de orçamento se mencionado no chat (ex: "até 80", "50 reais", "r$ 100", "gastar 60", "teto de 70")
  if (!extractedBudget) {
    const budgetMatch = normalized.match(/(?:at[eé]|or[cç]amento|m[aá]ximo|dentro de|gastar|teto|limite|menos de|valor)\s*(?:de)?\s*(?:r\$)?\s*(\d{2,3})/i)
      || normalized.match(/(?:r\$)\s*(\d{2,3})/i);
    if (budgetMatch && budgetMatch[1]) {
      extractedBudget = parseFloat(budgetMatch[1]);
    }
  }

  // Detectar preferências no chat (genéricos, mais barato, economia)
  let effectivePreferGenerics = preferGenerics;
  if (
    normalized.includes('genérico') ||
    normalized.includes('generico') ||
    normalized.includes('mais barato') ||
    normalized.includes('econom') ||
    normalized.includes('mais em conta')
  ) {
    effectivePreferGenerics = true;
  } else if (
    normalized.includes('de marca') ||
    normalized.includes('referência') ||
    normalized.includes('referencia') ||
    normalized.includes('original')
  ) {
    effectivePreferGenerics = false;
  }

  // Se já tiver uma lista customizada de IDs (por exemplo, após ajustes do usuário)
  let baseProductIds = [];

  // Verificação de medicamentos controlados ou restritos por receita (ANVISA)
  const isControlledQuery =
    normalized.includes('clonazepam') ||
    normalized.includes('rivotril') ||
    normalized.includes('zolpidem') ||
    normalized.includes('amoxicilina') ||
    normalized.includes('azitromicina') ||
    normalized.includes('ozempic') ||
    normalized.includes('semaglutida') ||
    normalized.includes('roacutan') ||
    normalized.includes('isotretinoina') ||
    normalized.includes('antibiotico') ||
    normalized.includes('antibiótico') ||
    normalized.includes('tarja preta') ||
    normalized.includes('tarja vermelha') ||
    normalized.includes('controlado') ||
    normalized.includes('calmante') ||
    normalized.includes('ansiolitico') ||
    normalized.includes('ansiolítico') ||
    normalized.includes('antidepressivo') ||
    normalized.includes('receita médica') ||
    normalized.includes('receita medica') ||
    normalized.includes('receita azul') ||
    normalized.includes('notificacao de receita') ||
    normalized.includes('notificação de receita') ||
    normalized.includes('insonia forte') ||
    normalized.includes('dormir forte');

  if (customSelectedIds && customSelectedIds.length > 0) {
    baseProductIds = [...customSelectedIds];
  } else if (isControlledQuery) {
    theme = 'controlled_rx';
    if (normalized.includes('clonazepam') || normalized.includes('rivotril') || normalized.includes('calmante') || normalized.includes('ansiolit')) {
      baseProductIds = effectivePreferGenerics ? ['prod-23'] : ['prod-27', 'prod-23'];
    } else if (normalized.includes('zolpidem') || normalized.includes('insonia') || normalized.includes('sono')) {
      baseProductIds = ['prod-24'];
    } else if (normalized.includes('amoxicilina') || (normalized.includes('antibiotico') && !normalized.includes('azitromicina'))) {
      baseProductIds = ['prod-22'];
    } else if (normalized.includes('azitromicina')) {
      baseProductIds = ['prod-26'];
    } else if (normalized.includes('ozempic') || normalized.includes('semaglutida')) {
      baseProductIds = ['prod-25'];
    } else if (normalized.includes('roacutan') || normalized.includes('isotretinoina')) {
      baseProductIds = ['prod-28'];
    } else {
      // Itens controlados gerais
      baseProductIds = ['prod-23', 'prod-22'];
    }
  } else if (normalized.includes('praia') || normalized.includes('sol') || normalized.includes('solar') || normalized.includes('verão') || normalized.includes('verao') || normalized.includes('piscina') || normalized.includes('mar') || normalized.includes('bronze')) {
    theme = 'praia';
    baseProductIds = effectivePreferGenerics || (extractedBudget && extractedBudget < 90)
      ? ['pm-nivea-sun', 'prod-03'] // Nivea Sun + Neutrogena Sun Fresh
      : ['pm-nivea-sun', 'prod-04', 'prod-21']; // Nivea Sun + CeraVe Hidratante + Repelente Off
  } else if (normalized.includes('acne') || normalized.includes('pele') || normalized.includes('oleos') || normalized.includes('skincare') || normalized.includes('rosto')) {
    theme = 'skincare';
    baseProductIds = effectivePreferGenerics || (extractedBudget && extractedBudget < 100)
      ? ['prod-01', 'prod-03'] // Actine + Neutrogena Sun Fresh
      : ['prod-01', 'prod-04', 'prod-02']; // Actine + CeraVe + Episol
  } else if (normalized.includes('viagem') || normalized.includes('primeiros socorros') || normalized.includes('carro') || normalized.includes('socorro') || normalized.includes('férias') || normalized.includes('ferias')) {
    theme = 'viagem';
    baseProductIds = effectivePreferGenerics || (extractedBudget && extractedBudget < 60)
      ? ['prod-19', 'prod-07', 'prod-21'] // Curativo + Dipirona Gotas + Repelente
      : ['prod-19', 'prod-07', 'prod-21', 'prod-20']; // + Termômetro
  } else if (normalized.includes('gripe') || normalized.includes('resfriado') || normalized.includes('imunidade') || normalized.includes('coriza') || normalized.includes('nariz') || normalized.includes('febre')) {
    theme = 'gripe';
    baseProductIds = effectivePreferGenerics
      ? ['prod-10', 'prod-11', 'prod-14'] // Benegrip + Sorine + Vitamina C Sempre Bem
      : ['prod-10', 'prod-11', 'prod-13']; // Benegrip + Sorine + Cewin
  } else if (normalized.includes('repetir') || normalized.includes('habitual') || normalized.includes('dor') || normalized.includes('muscular') || normalized.includes('cabeça') || normalized.includes('cabeca')) {
    theme = 'recompra';
    baseProductIds = effectivePreferGenerics
      ? ['prod-07', 'prod-09', 'prod-14'] // Genéricos: Dipirona EMS + Orfenadrina Neo Química + Vit C Sempre Bem
      : ['prod-06', 'prod-08', 'prod-13']; // Marcas de referência: Neosaldina + Dorflex + Cewin
  } else if (normalized.includes('bebê') || normalized.includes('bebe') || normalized.includes('fralda') || normalized.includes('maternidade')) {
    theme = 'baby';
    baseProductIds = ['prod-16', 'prod-17', 'prod-18'];
  } else if (normalized.includes('orçamento') || normalized.includes('econom') || normalized.includes('50 reais')) {
    theme = 'economia';
    baseProductIds = ['prod-07', 'prod-09', 'prod-19'];
  } else {
    // Busca inteligente por palavras-chave no catálogo
    const matched = CATALOG.filter(item => {
      const matchName = item.name.toLowerCase().includes(normalized);
      const matchTags = item.tags.some(t => normalized.includes(t));
      const matchBrand = item.brand.toLowerCase().includes(normalized);
      return matchName || matchTags || matchBrand;
    });

    if (matched.length > 0) {
      baseProductIds = matched.slice(0, 3).map(i => i.id);
    } else {
      // Fallback seguro de kit diário essencial
      baseProductIds = ['prod-01', 'prod-07', 'prod-14'];
    }
  }

  // Detectar remoções solicitadas em chat (ex: "tirar vitamina", "sem protetor")
  if (normalized.includes('tirar ') || normalized.includes('remover ') || normalized.includes('sem ')) {
    baseProductIds = baseProductIds.filter(id => {
      const prod = CATALOG.find(p => p.id === id);
      if (!prod) return true;
      const lowerName = prod.name.toLowerCase();
      const lowerRole = (prod.clinicalRole || '').toLowerCase();
      const lowerCategory = (prod.category || '').toLowerCase();
      if (normalized.includes('vitamina') && (lowerName.includes('vitamina') || lowerName.includes('cewin'))) return false;
      if (normalized.includes('protetor') && (lowerName.includes('protetor') || lowerName.includes('solar') || lowerCategory === 'solar')) return false;
      if (normalized.includes('sorine') && lowerName.includes('sorine')) return false;
      if (normalized.includes('descongestionante') && (lowerRole.includes('descongestionante') || lowerName.includes('sorine'))) return false;
      if (normalized.includes('curativo') && (lowerName.includes('curativo') || lowerName.includes('band-aid'))) return false;
      return true;
    });
  }

  // 2. Aplicação do filtro de Genéricos / Econômicos
  if (effectivePreferGenerics) {
    baseProductIds = baseProductIds.map(id => {
      const prod = CATALOG.find(p => p.id === id);
      if (prod && prod.genericEquivalentId) {
        return prod.genericEquivalentId;
      }
      return id;
    });
  }

  // 3. Montar a lista de produtos resolvidos
  let recommendedItems = baseProductIds
    .map(id => CATALOG.find(p => p.id === id))
    .filter(Boolean);

  // 4. Verificação de Orçamento
  let currentTotal = recommendedItems.reduce((acc, p) => acc + p.clubPrice, 0);

  // Se exceder o orçamento estipulado e o cliente especificou um teto, tentar trocar itens caros por genéricos
  if (extractedBudget && currentTotal > extractedBudget) {
    recommendedItems = recommendedItems.map(item => {
      if (item.genericEquivalentId) {
        const genItem = CATALOG.find(p => p.id === item.genericEquivalentId);
        if (genItem) return genItem;
      }
      return item;
    });
    currentTotal = recommendedItems.reduce((acc, p) => acc + p.clubPrice, 0);

    // Se ainda exceder, remove itens menos prioritários até caber
    while (recommendedItems.length > 1 && currentTotal > extractedBudget) {
      recommendedItems.pop();
      currentTotal = recommendedItems.reduce((acc, p) => acc + p.clubPrice, 0);
    }
  }

  const originalTotal = recommendedItems.reduce((acc, p) => acc + p.originalPrice, 0);
  const regularTotal = recommendedItems.reduce((acc, p) => acc + p.price, 0);
  const savingsTotal = originalTotal - currentTotal;

  // 5. Raciocínio Clínico e Justificativa Farmacêutica
  let rationale = '';
  let journeyTitle = '';

  if (theme === 'controlled_rx') {
    journeyTitle = 'Medicamento de Controle Especial & Prescrição Obrigatória (ANVISA)';
    rationale = 'Identificamos que você buscou por medicamento sob controle especial da ANVISA (Portaria SVS/MS 344/98 e RDC 20/2011). Por exigência legal e proteção à sua saúde, este produto NÃO pode ser comprado livremente sem prescrição médica válida. Por favor, procure um médico para obter a receita correta ou anexe sua receita médica oficial para que nosso farmacêutico possa validar e liberar sua compra com total segurança.';
  } else if (theme === 'praia') {
    journeyTitle = 'Kit Proteção Solar & Cuidados de Praia e Verão';
    rationale = 'Esta cesta une alta proteção solar contra raios UVA/UVB com toque seco e hidratação restauradora pós-exposição solar. Previne queimaduras solares, ressecamento e fotoenvelhecimento, mantendo a pele saudável e protegida na praia ou piscina.';
  } else if (theme === 'skincare') {
    journeyTitle = 'Rotina Facial Equilibrada para Pele Oleosa';
    rationale = 'Esta combinação une controle de sebo com hidratação leve. O ácido salicílico limpa profundamente os poros, enquanto o protetor de toque seco previne manchas solares sem deixar aspecto oleoso ou causar acne por efeito rebote.';
  } else if (theme === 'viagem') {
    journeyTitle = 'Kit Essencial de Primeiros Socorros & Férias';
    rationale = 'Kit indispensável montado para emergências comuns de viagem: alívio rápido de febre/dor sem necessidade de prescrição, proteção oclusiva com curativos e repelente contra picadas de mosquitos vetores.';
  } else if (theme === 'gripe') {
    journeyTitle = 'Cesta de Alívio Gripal & Suporte Imunológico';
    rationale = 'Abordagem combinada: alívio dos sintomas clássicos (dor no corpo e congestão com higienização nasal estéril) somado ao suporte de Vitamina C para reforço da resposta imunitária natural.';
  } else if (theme === 'recompra') {
    journeyTitle = preferGenerics ? 'Recompra Otimizada com Genéricos FarmaViva' : 'Sua Cesta de Cuidados Habitual';
    rationale = preferGenerics
      ? 'Identificamos seus produtos habituais e substituímos pelas versões genéricas homologadas pela ANVISA (mesma molécula e eficácia comprovada), reduzindo o valor final significativamente.'
      : 'Reunimos seus itens mais frequentes para facilitar sua reposição rápida em 1 clique com os melhores descontos do Clube FarmaViva.';
  } else if (theme === 'baby') {
    journeyTitle = 'Cuidado Diário Mamãe & Bebê';
    rationale = 'Seleção dermatologicamente testada e segura para a pele sensível do recém-nascido e da criança, focando em proteção prolongada e prevenção ativa de assaduras.';
  } else {
    journeyTitle = 'Seleção Personalizada de Farmácia';
    rationale = 'Produtos selecionados para atender sua necessidade diária de saúde e bem-estar, com máxima conveniência e garantia de procedência Farmácia FarmaViva.';
  }

  // 6. Camada de Segurança Farmacêutica e Compliance ANVISA
  const hasControlled = recommendedItems.some(i => i.isControlled) || isControlledQuery;
  const hasRx = recommendedItems.some(i => i.requiresPrescription) || hasControlled;
  const rxItems = recommendedItems.filter(i => i.requiresPrescription || i.isControlled);

  const safetyNotice = {
    hasPrescriptionRequired: hasRx,
    isControlled: hasControlled,
    requiresPrescriptionValidation: hasRx,
    rxItems: rxItems.map(i => i.name),
    disclaimer: 'SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO. MEDICAMENTO SOB CONTROLE SANITÁRIO.',
    pharmacistSupervision: 'Seleção orientada por inteligência de dados com supervisão técnica farmacêutica Farmácia FarmaViva (CRF/SP ativo).',
    warningText: hasRx
      ? 'Atenção: Medicamento sujeito a controle especial da ANVISA. Consulte um médico ou anexe sua receita para validar e liberar a compra.'
      : 'Todos os medicamentos incluídos são Isentos de Prescrição (MIPs). Siga a posologia indicada na bula.',
    doctorAdvice: 'IMPORTANTE: Medicamentos controlados e antibióticos exigem diagnóstico prévio com médico especialista. A automedicação apresenta sérios riscos à saúde (dependência, efeitos colaterais e resistência microbiana).',
    prescriptionInstructions: 'Envie uma foto legível da receita médica física carimbada com CRM ou faça upload do PDF da receita digital ICP-Brasil / Memed para validação farmacêutica imediata.'
  };

  // 7. Ações de refinamento rápido disponíveis (sem reiniciar busca)
  const quickRefinements = [
    {
      id: 'toggle-generics',
      label: preferGenerics ? 'Voltar para marcas de referência' : 'Trocar todos por genéricos mais baratos',
      active: preferGenerics
    },
    {
      id: 'budget-adjust',
      label: extractedBudget ? `Ajustar teto (Atual: R$ ${extractedBudget.toFixed(0)})` : 'Definir limite de orçamento'
    },
    {
      id: 'remove-highest',
      label: 'Remover item mais caro para economizar'
    }
  ];

  return {
    theme,
    journeyTitle,
    rationale,
    appliedPrompt: prompt,
    preferGenerics: effectivePreferGenerics,
    targetBudget: extractedBudget,
    isWithinBudget: extractedBudget ? currentTotal <= extractedBudget : true,
    totalPrice: currentTotal,
    originalTotal,
    regularTotal,
    savingsTotal,
    recommendedItems,
    safetyNotice,
    quickRefinements
  };
}
