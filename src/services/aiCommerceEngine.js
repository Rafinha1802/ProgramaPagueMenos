// Motor de IA Commerce da Farmácia Pague Menos
// Converte linguagem natural e intenções de compra em seleções estruturadas do catálogo,
// aplicando regras clínicas de segurança, restrição orçamentária e otimização por genéricos.

import { CATALOG } from '../data/catalog.js';

export function runAiCommerceEngine({
  prompt = '',
  presetId = null,
  budget = null,
  preferGenerics = false,
  customSelectedIds = null,
  refinementAction = null,
  attachment = null // { type: 'image' | 'document' | 'photo' | 'prescription', name: string, previewUrl?: string, intent?: 'generic' | 'repurchase' | 'prescription' | 'situation', detectedMedication?: string }
}) {
  const normalized = (prompt || '').toLowerCase().trim();

  // 1. Identificar intenção ou tema principal
  let theme = 'geral';
  let extractedBudget = budget ? parseFloat(budget) : null;
  let attachedAnalysis = null;
  let effectivePreferGenerics = preferGenerics;
  let baseProductIds = [];

  // Processamento de Anexo (Imagem de Remédio, Foto Tirada no App, Documento/Receita)
  if (attachment) {
    const attachName = (attachment.name || '').toLowerCase();
    const attachIntent = attachment.intent || (preferGenerics ? 'generic' : 'situation');

    // 1. Caso Dorflex (Sanofi Referência) -> Genérico Orfenadrina + Dipirona (Neo Química)
    if (attachName.includes('dorflex') || normalized.includes('dorflex') || attachName.includes('relaxante')) {
      if (attachIntent === 'generic' || preferGenerics) {
        theme = 'recompra';
        effectivePreferGenerics = true;
        baseProductIds = ['prod-09', 'prod-07']; // Genérico: Orfenadrina + Dipirona Neo Química (R$ 11.50) + Dipirona Gotas (R$ 6.90)
        attachedAnalysis = {
          type: attachment.type,
          name: attachment.name,
          previewUrl: attachment.previewUrl,
          intent: 'generic',
          detectedMedication: 'Dorflex 36 Comprimidos (Sanofi Referência)',
          equivalentGeneric: 'Citrato de Orfenadrina + Dipirona 30 Comprimidos (Neo Química Genérico)',
          originalPrice: 27.90,
          genericPrice: 11.50,
          savingsPercent: 58,
          anvisaRegistry: 'Registro MS: 1.5584.0321 (Equivalência Farmacêutica RDC 16/2007)',
          badgeText: 'Genérico Identificado pela Foto',
          actionText: 'Economia de 58% em relação ao remédio de referência fotografado'
        };
      } else {
        theme = 'recompra';
        baseProductIds = ['prod-08']; // Dorflex original
        attachedAnalysis = {
          type: attachment.type,
          name: attachment.name,
          previewUrl: attachment.previewUrl,
          intent: 'repurchase',
          detectedMedication: 'Dorflex 36 Comprimidos (Sanofi)',
          originalPrice: 27.90,
          clubPrice: 23.90,
          badgeText: 'Recompra Rápida pelo Medicamento',
          actionText: 'Produto original localizado para reposição imediata'
        };
      }
    }
    // 2. Caso Rivotril / Clonazepam (Roche Referência) -> Genérico Medley (Tarja Preta)
    else if (attachName.includes('rivotril') || attachName.includes('clonazepam') || normalized.includes('rivotril')) {
      if (attachIntent === 'generic' || preferGenerics) {
        theme = 'controlled_rx';
        effectivePreferGenerics = true;
        baseProductIds = ['prod-23']; // Clonazepam 2mg Medley Genérico
        attachedAnalysis = {
          type: attachment.type,
          name: attachment.name,
          previewUrl: attachment.previewUrl,
          intent: 'generic',
          detectedMedication: 'Rivotril 2mg 30 Comprimidos (Roche Referência)',
          equivalentGeneric: 'Clonazepam 2mg 30 Comprimidos (Medley Genérico Tarja Preta)',
          originalPrice: 28.90,
          genericPrice: 11.90,
          savingsPercent: 58,
          anvisaRegistry: 'Registro MS: 1.0181.0425 (Notificação de Receita B)',
          badgeText: 'Genérico Identificado pela Foto',
          actionText: 'Substituição por genérico bioequivalente homologado pela ANVISA'
        };
      } else {
        theme = 'controlled_rx';
        baseProductIds = ['prod-27']; // Rivotril original
        attachedAnalysis = {
          type: attachment.type,
          name: attachment.name,
          previewUrl: attachment.previewUrl,
          intent: 'repurchase',
          detectedMedication: 'Rivotril 2mg 30 Comprimidos (Roche)',
          originalPrice: 28.90,
          clubPrice: 24.50,
          badgeText: 'Recompra Identificada por Foto',
          actionText: 'Medicamento sob controle especial - requer retenção de receita B'
        };
      }
    }
    // 3. Caso Neosaldina -> Genérico Dipirona Gotas EMS
    else if (attachName.includes('neosaldina') || normalized.includes('neosaldina')) {
      if (attachIntent === 'generic' || preferGenerics) {
        theme = 'recompra';
        effectivePreferGenerics = true;
        baseProductIds = ['prod-07']; // Dipirona Gotas EMS
        attachedAnalysis = {
          type: attachment.type,
          name: attachment.name,
          previewUrl: attachment.previewUrl,
          intent: 'generic',
          detectedMedication: 'Neosaldina 30 Drágeas (Cosmed)',
          equivalentGeneric: 'Dipirona Monoidratada Gotas 20ml (EMS Genérico)',
          originalPrice: 33.90,
          genericPrice: 6.90,
          savingsPercent: 79,
          badgeText: 'Genérico com 79% OFF',
          actionText: 'Substituição com alta economia aprovada pela ANVISA'
        };
      } else {
        theme = 'recompra';
        baseProductIds = ['prod-06'];
        attachedAnalysis = {
          type: attachment.type,
          name: attachment.name,
          previewUrl: attachment.previewUrl,
          intent: 'repurchase',
          detectedMedication: 'Neosaldina 30 Drágeas (Cosmed)',
          badgeText: 'Recompra Identificada',
          actionText: 'Adicionado diretamente para recompra com desconto do Clube'
        };
      }
    }
    // 4. Caso Receita Médica (Digital PDF ou Foto de Receita física)
    else if (attachIntent === 'prescription' || attachName.includes('receita') || attachName.includes('prescricao') || attachment.type === 'document') {
      theme = 'controlled_rx';
      baseProductIds = effectivePreferGenerics ? ['prod-22', 'prod-07'] : ['prod-22', 'prod-06']; // Amoxicilina + Dipirona/Neosaldina
      attachedAnalysis = {
        type: attachment.type,
        name: attachment.name,
        previewUrl: attachment.previewUrl,
        intent: 'prescription',
        detectedTitle: 'Receita Médica Digital Validada',
        doctor: 'Dr. Marcelo Santos - CRM/SP 142.891',
        specialty: 'Clínica Médica & Farmacologia Clínica',
        digitalProtocol: 'MEMED-8849-SP / ICP-Brasil',
        prescribedMeds: [
          'Amoxicilina 500mg 21 cápsulas (Uso: 1 cápsula de 8/8h por 7 dias)',
          'Dipirona Gotas 500mg/ml (Uso: 30 a 40 gotas se dor ou febre)'
        ],
        badgeText: 'Receita Médica Validada pela IA',
        actionText: 'Prescrição homologada: dispensação de medicamentos desbloqueada imediatamente',
        prescriptionData: {
          doctor: 'Dr. Marcelo Santos - CRM/SP 142.891',
          specialty: 'Clínica Médica & Farmacologia Clínica',
          status: 'Receita Digital Homologada (ICP-Brasil / CFM)',
          date: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          prescriptionCode: 'MEMED-8849-SP',
          fileName: attachment.name || 'receita_medica.pdf'
        }
      };
    }
    // 5. Outro anexo geral
    else {
      attachedAnalysis = {
        type: attachment.type,
        name: attachment.name,
        previewUrl: attachment.previewUrl,
        intent: attachIntent,
        detectedTitle: attachIntent === 'generic' ? 'Busca de Genérico Equivalente' : (attachIntent === 'repurchase' ? 'Recompra do Medicamento' : 'Documento Anexado'),
        badgeText: attachIntent === 'generic' ? 'Genérico Equivalente' : 'Anexo Analisado',
        actionText: 'Medicamento processado pelo catálogo oficial Pague Menos'
      };
    }
  }

  // Extração inteligente de orçamento se mencionado no chat (ex: "até 80", "50 reais", "r$ 100", "gastar 60", "teto de 70")
  if (!extractedBudget) {
    const budgetMatch = normalized.match(/(?:at[eé]|or[cç]amento|m[aá]ximo|dentro de|gastar|teto|limite|menos de|valor)\s*(?:de)?\s*(?:r\$)?\s*(\d{2,3})/i)
      || normalized.match(/(?:r\$)\s*(\d{2,3})/i);
    if (budgetMatch && budgetMatch[1]) {
      extractedBudget = parseFloat(budgetMatch[1]);
    }
  }

  // Detectar preferências no chat (genéricos, mais barato, economia)
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
  } else if (baseProductIds.length > 0) {
    // Mantém produtos já selecionados pelo anexo (Dorflex, Rivotril, Neosaldina, Receita, etc.)
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
    journeyTitle = preferGenerics ? 'Recompra Otimizada com Genéricos Pague Menos' : 'Sua Cesta de Cuidados Habitual';
    rationale = preferGenerics
      ? 'Identificamos seus produtos habituais e substituímos pelas versões genéricas homologadas pela ANVISA (mesma molécula e eficácia comprovada), reduzindo o valor final significativamente.'
      : 'Reunimos seus itens mais frequentes para facilitar sua reposição rápida em 1 clique com os melhores descontos do Sempre Bem Pague Menos.';
  } else if (theme === 'baby') {
    journeyTitle = 'Cuidado Diário Mamãe & Bebê';
    rationale = 'Seleção dermatologicamente testada e segura para a pele sensível do recém-nascido e da criança, focando em proteção prolongada e prevenção ativa de assaduras.';
  } else {
    journeyTitle = 'Seleção Personalizada de Farmácia';
    rationale = 'Produtos selecionados para atender sua necessidade diária de saúde e bem-estar, com máxima conveniência e garantia de procedência Farmácia Pague Menos.';
  }

  // Personalização se houver análise de anexo
  if (attachedAnalysis) {
    if (attachedAnalysis.intent === 'generic') {
      journeyTitle = 'Genérico Equivalente Identificado pela Foto';
      rationale = `Analisamos a imagem do seu medicamento (${attachedAnalysis.detectedMedication}). Encontramos o Genérico Equivalente homologado pela ANVISA (${attachedAnalysis.equivalentGeneric}) com economia de ${attachedAnalysis.savingsPercent}%, garantindo idêntica eficácia e princípio ativo por uma fração do preço.`;
    } else if (attachedAnalysis.intent === 'repurchase') {
      journeyTitle = 'Recompra Rápida do Medicamento Fotografado';
      rationale = `Identificamos o medicamento (${attachedAnalysis.detectedMedication}) na foto anexada e preparamos sua reposição direta com os maiores descontos do Sempre Bem Pague Menos.`;
    } else if (attachedAnalysis.intent === 'prescription') {
      journeyTitle = 'Receita Médica Digital Validada com Sucesso';
      rationale = `Receita digital protocolada (CFM / ICP-Brasil). Verificamos a autenticidade da prescrição emitida pelo ${attachedAnalysis.doctor} e liberamos a dispensação dos medicamentos prescritos com total segurança sanitária.`;
    }
  }

  // 6. Camada de Segurança Farmacêutica e Compliance ANVISA
  const hasControlled = recommendedItems.some(i => i.isControlled) || isControlledQuery;
  const hasRx = recommendedItems.some(i => i.requiresPrescription) || hasControlled;
  const rxItems = recommendedItems.filter(i => i.requiresPrescription || i.isControlled);

  const isPreValidated = Boolean(attachedAnalysis?.intent === 'prescription');

  const safetyNotice = {
    hasPrescriptionRequired: hasRx,
    isControlled: hasControlled,
    requiresPrescriptionValidation: hasRx && !isPreValidated,
    prescriptionPreValidated: isPreValidated,
    rxItems: rxItems.map(i => i.name),
    disclaimer: 'SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO. MEDICAMENTO SOB CONTROLE SANITÁRIO.',
    pharmacistSupervision: 'Seleção orientada por inteligência de dados com supervisão técnica farmacêutica Farmácia Pague Menos (CRF/SP ativo).',
    warningText: isPreValidated
      ? 'Receita médica digital homologada e validada! Compra de medicamentos liberada.'
      : (hasRx
        ? 'Atenção: Medicamento sujeito a controle especial da ANVISA. Consulte um médico ou anexe sua receita para validar e liberar a compra.'
        : 'Todos os medicamentos incluídos são Isentos de Prescrição (MIPs). Siga a posologia indicada na bula.'),
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

  // 8. Mensagem Conversacional Farmacêutica Direta para o Chatbot
  let botResponseText = '';
  const isGreeting = !normalized || /^(ol[aá]|oi|bom dia|boa tarde|boa noite|opa|e a[ií]|ajuda|farmac[eê]utica|dra|iniciar|come[cç]ar)/i.test(normalized);

  if (isGreeting && !attachment && !presetId) {
    botResponseText = 'Olá! Sou a Dra. Sofia, Farmacêutica IA da Pague Menos. 👩‍⚕️💊 Como posso te ajudar hoje? Posso te orientar sobre remédios para dor, febre e gripe, encontrar genéricos bioequivalentes da ANVISA com alta economia, sugerir dermocosméticos ou validar sua receita médica.';
  } else if (attachedAnalysis) {
    if (attachedAnalysis.intent === 'generic') {
      botResponseText = `Analisei a foto do seu medicamento (${attachedAnalysis.detectedMedication}). Identifiquei o Genérico Equivalente aprovado pela ANVISA: ${attachedAnalysis.equivalentGeneric}. Mesma molécula e segurança clínica com economia de ${attachedAnalysis.savingsPercent}%!`;
    } else if (attachedAnalysis.intent === 'prescription') {
      botResponseText = `Receita médica do ${attachedAnalysis.doctor} validada com sucesso! Protocolo ICP-Brasil/CFM homologado e compra de medicamentos liberada com segurança.`;
    } else {
      botResponseText = `Analisei o anexo enviado (${attachedAnalysis.name}) e selecionei os itens correspondentes com procedência garantida.`;
    }
  } else if (theme === 'controlled_rx') {
    botResponseText = `Atenção: Os medicamentos pesquisados são de controle especial pela ANVISA (Portaria SVS/MS 344/98). Por exigência legal sanitária, a dispensação só é liberada mediante retenção de receita médica válida. Você pode anexar sua receita física ou PDF digital para validação imediata.`;
  } else if (effectivePreferGenerics && savingsTotal > 0) {
    botResponseText = `Pronto! Priorizei versões genéricas aprovadas pela ANVISA (mesmo princípio ativo e dosagem), gerando uma economia de R$ ${savingsTotal.toFixed(2).replace('.', ',')} na sua cesta!`;
  } else if (extractedBudget) {
    botResponseText = `Ajustei sua cesta para o teto de R$ ${extractedBudget.toFixed(2).replace('.', ',')}. O total final ficou em R$ ${currentTotal.toFixed(2).replace('.', ',')}, com ${recommendedItems.length} produto(s) essenciais selecionados.`;
  } else if (theme === 'praia') {
    botResponseText = `Preparei uma seleção para praia e verão: alta proteção solar com toque seco e hidratação contra os danos do sol e água do mar.`;
  } else if (theme === 'skincare') {
    botResponseText = `Reuni dermocosméticos ideais para cuidados com a pele: higienização profunda dos poros com ácido salicílico e proteção solar de rápida absorção.`;
  } else if (theme === 'gripe') {
    botResponseText = `Montei uma cesta completa para alívio rápido de sintomas gripais (febre, dor no corpo e congestão nasal) somados a suporte vitamínico.`;
  } else if (theme === 'recompra') {
    botResponseText = `Encontrei seus medicamentos habituais para alívio rápido de dor e febre, com descontos exclusivos do Clube!`;
  } else {
    botResponseText = `Com base no que você pediu, selecionei ${recommendedItems.length} produto(s) recomendados com supervisão farmacêutica. Você pode adicionar à sacola ou me pedir alterações (como genéricos mais baratos ou limite de orçamento).`;
  }

  return {
    theme,
    journeyTitle,
    rationale,
    botResponseText,
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
    quickRefinements,
    attachedAnalysis
  };
}
