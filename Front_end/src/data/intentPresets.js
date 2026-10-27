// Presets de Intenção e Jornadas Rápidas com IDs reais do catálogo back_PagueMenos

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
        budget: 150,
        targetProductIds: ['57259', '183582', '138889'],
        badge: 'Mais Pedido'
      },
      {
        id: 'kit-viagem-socorros',
        label: 'Kit Primeiros Socorros & Alívio Rápido',
        prompt: 'Preciso de um kit de primeiros socorros para viagem: soro, alívio de dor e congestão nasal',
        budget: 45,
        targetProductIds: ['46533', '18537', '18064'],
        badge: 'Essencial'
      },
      {
        id: 'kit-bebe-nutri',
        label: 'Kit Cuidados Infantis & Família',
        prompt: 'Protetor solar infantil e cuidados familiares com qualidade Pague Menos',
        budget: 110,
        targetProductIds: ['57295', '46533'],
        badge: 'Família'
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
        prompt: 'Quero produtos essenciais de alívio de dores, desodorante e soro gastando no máximo 50 reais',
        budget: 50,
        targetProductIds: ['18537', '46533', '183582'],
        badge: 'Super Econômico'
      },
      {
        id: 'orcamento-80-dermo',
        label: 'Rotina Dermo & Beleza até R$ 80',
        prompt: 'Quero protetor solar toque seco Principia e desodorante clinical em super oferta até 80 reais',
        budget: 80,
        targetProductIds: ['138889', '183582'],
        badge: 'Mais Pedido'
      },
      {
        id: 'orcamento-100-familia',
        label: 'Cuidados Família até R$ 100',
        prompt: 'Cesta familiar com protetor Nivea e itens essenciais dentro de 100 reais',
        budget: 100,
        targetProductIds: ['57295', '46533', '18537'],
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
        prompt: 'Quero repetir minha compra habitual de alívio de dor de cabeça, soro e desodorante economizando com genéricos',
        budget: 60,
        targetProductIds: ['18537', '46533', '183582'],
        badge: 'Economia Garantida'
      },
      {
        id: 'repetir-higiene',
        label: 'Reposição Mensal de Higiene & Proteção',
        prompt: 'Repor protetor solar toque seco e desodorantes em oferta',
        budget: 120,
        targetProductIds: ['57259', '183582'],
        badge: 'Ofertas Ativas'
      }
    ]
  }
];
