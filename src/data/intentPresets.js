// Presets de Intenção e Jornadas Rápidas para a Farmácia Pague Menos

export const INTENT_PRESETS = [
  {
    id: 'montar-kit',
    title: 'Montar um kit',
    subtitle: 'Soluções completas para sua rotina com proteção e cuidado',
    icon: 'PackagePlus',
    quickOptions: [
      {
        id: 'kit-pele-dermo',
        label: 'Kit Proteção Solar & Toque Seco',
        prompt: 'Monte um kit de proteção solar com toque seco e higiene facial para o dia a dia',
        budget: 95,
        targetProductIds: ['pm-nivea-sun', 'prod-01', 'pm-secret-clinical'],
        badge: 'Super Oferta'
      },
      {
        id: 'kit-viagem-socorros',
        label: 'Kit Primeiros Socorros & Alívio Rápido',
        prompt: 'Preciso de um kit de primeiros socorros para viagem: curativos, alívio de dor de cabeça e febre',
        budget: 45,
        targetProductIds: ['prod-19', 'prod-07', 'prod-09'],
        badge: 'Essencial'
      },
      {
        id: 'kit-bebe-nutri',
        label: 'Kit Nutrição & Cuidado Infantil',
        prompt: 'Fórmula infantil e cuidados para bebê de 1 a 3 anos',
        budget: 110,
        targetProductIds: ['pm-aptanutri', 'prod-14'],
        badge: 'Mamães e Bebês'
      }
    ]
  },
  {
    id: 'dentro-orcamento',
    title: 'Comprar dentro do meu orçamento',
    subtitle: 'A IA equilibra os melhores produtos sem ultrapassar o seu teto',
    icon: 'Wallet',
    quickOptions: [
      {
        id: 'orcamento-50',
        label: 'Cesta Essencial até R$ 50',
        prompt: 'Quero produtos essenciais de alívio de dores, relaxante muscular e curativo gastando no máximo 50 reais',
        budget: 50,
        targetProductIds: ['prod-07', 'prod-09', 'prod-19'],
        badge: 'Super Econômico'
      },
      {
        id: 'orcamento-80-dermo',
        label: 'Rotina Dermo & Beleza até R$ 80',
        prompt: 'Quero protetor solar toque seco Nivea e desodorante clinical em super oferta até 80 reais',
        budget: 80,
        targetProductIds: ['pm-nivea-sun', 'pm-secret-clinical'],
        badge: 'Mais Pedido'
      },
      {
        id: 'orcamento-100-familia',
        label: 'Cuidados Família até R$ 100',
        prompt: 'Cesta familiar com vitaminas Pague Menos, desodorante e alívio de dor dentro de 100 reais',
        budget: 100,
        targetProductIds: ['prod-14', 'pm-nivea-men', 'prod-08', 'prod-07'],
        badge: 'Família'
      }
    ]
  },
  {
    id: 'repetir-compra',
    title: 'Repetir minha compra',
    subtitle: 'Recompra inteligente: otimiza seus produtos habituais com genéricos mais baratos',
    icon: 'RotateCw',
    quickOptions: [
      {
        id: 'repetir-otimizado',
        label: 'Repetir última cesta com Genéricos Pague Menos',
        prompt: 'Quero repetir minha compra habitual de relaxante muscular, dor de cabeça e vitamina C, mas economizando com alternativas genéricas',
        budget: 60,
        targetProductIds: ['prod-07', 'prod-09', 'prod-14'],
        comparisonOriginalIds: ['prod-06', 'prod-08', 'prod-10'],
        badge: 'Economia de 52%'
      },
      {
        id: 'repetir-higiene',
        label: 'Reposição Mensal de Higiene & Proteção',
        prompt: 'Repor protetor solar Nivea e desodorantes em oferta',
        budget: 90,
        targetProductIds: ['pm-nivea-sun', 'pm-nivea-men', 'pm-secret-clinical'],
        badge: 'Ofertas Ativas'
      }
    ]
  }
];
