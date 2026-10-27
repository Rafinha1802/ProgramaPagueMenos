"""Guardrails determinísticos da Anvisa (camadas 1, 2, 3).

Regra inegociável: o LLM NÃO decide se é seguro. Quem decide são
estas funções puras. Elas são testáveis em milissegundos.
"""
from typing import Any, Dict

from app.core.text_utils import normaliza


# ---------------------------------------------------------------
# Camada 1 — intenção do usuário
# ---------------------------------------------------------------
PALAVRAS_RISCO_INTENCAO: Dict[str, list] = {
    "diagnostico": [
        "diagnostico", "diagnosticar", "o que eu tenho", "qual minha doenca",
        "o que pode ser", "sera que e",
    ],
    "dosagem": [
        "quantas gotas", "quantos comprimidos", "quanto devo tomar",
        "dose infantil", "dose para bebe", "dose para crianca",
        "quantas vezes ao dia", "de quanto em quanto tempo",
    ],
    "prescricao": [
        "prescreva", "me receite", "receite", "remedio para curar",
    ],
    "gravidez": [
        "posso tomar gravida", "durante a gravidez", "amamentando posso",
        "estou gestante", "na gravidez", "abortar", "abortivo",
    ],
    "substituicao": [
        "substituir receita", "substituir sem falar",
    ],
}


def camada_1_intencao(query: str) -> Dict[str, Any]:
    """Detecta intenção de risco severo.
    
    Permite consultas legítimas sobre sintomas cotidianos e MIPs (Medicamentos
    Isentos de Prescrição) conforme RDC 44/2009 e Lei 5.991/73, bloqueando apenas
    riscos graves como automedicação perigosa, abortivos ou substâncias controladas.
    """
    q = normaliza(query)
    for categoria, gatilhos in PALAVRAS_RISCO_INTENCAO.items():
        for g in gatilhos:
            if g in q:
                return {"safe": False, "categoria": categoria, "gatilho": g}
    return {"safe": True, "categoria": None, "gatilho": None}


# ---------------------------------------------------------------
# Camada 2 — conteúdo do produto (receita)
# ---------------------------------------------------------------
def camada_2_conteudo(produto: Dict[str, Any]) -> Dict[str, Any]:
    """Bloqueia produto com is_prescription=True."""
    if bool(produto.get("is_prescription", False)):
        return {
            "safe": False,
            "motivo": "receita_obrigatoria",
            "sinais": produto.get("sinais_fortes", ""),
        }
    return {"safe": True}


# ---------------------------------------------------------------
# Camada 3 — estoque
# ---------------------------------------------------------------
def camada_3_estoque(produto: Dict[str, Any]) -> Dict[str, Any]:
    """Bloqueia produto indisponível."""
    if not bool(produto.get("is_available", True)):
        return {"safe": False, "motivo": "sem_estoque"}
    return {"safe": True}


# ---------------------------------------------------------------
# Feature engineering de receita (extraído da célula 6)
# ---------------------------------------------------------------
REGRAS_FORTES = {
    "categoria_antibiotico": lambda c, d: "antibiotic" in c,
    "categoria_controlado":  lambda c, d: "controlad" in c,
    "desc_prescricao":       lambda c, d: any(
        s in d for s in [
            "sob prescricao", "receita obrigatoria", "uso sob prescricao",
            "uso conforme orientacao medica",
        ]
    ),
    "desc_tarja":            lambda c, d: "tarja preta" in d or "tarja vermelha" in d,
    "desc_antibiotico":      lambda c, d: "antibiotic" in d,
}
REGRA_FRACA = {"categoria_medicamentos": lambda c, d: "medicament" in c}


def classifica_produto(category_path: str, description: str) -> Dict[str, Any]:
    """Classifica um produto em is_prescription / suspeita com auditoria."""
    c = normaliza(category_path)
    d = normaliza(description)
    sinais_fortes = [nome for nome, regra in REGRAS_FORTES.items() if regra(c, d)]
    sinais_fracos = [nome for nome, regra in REGRA_FRACA.items() if regra(c, d)]
    return {
        "is_prescription": len(sinais_fortes) > 0,
        "sinais_fortes":   sinais_fortes,
        "sinais_fracos":   sinais_fracos,
        "suspeita":        (len(sinais_fortes) == 0) and (len(sinais_fracos) > 0),
    }


# ---------------------------------------------------------------
# Mensagens regulatórias
# ---------------------------------------------------------------
AVISO_RODAPE = (
    "\n\n💡 *Este assistente não diagnostica, não prescreve e não orienta dosagem.*\n"
    "*AO PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO.*"
)


def mensagem_bloqueio_intencao(categoria: str, gatilho: str) -> str:
    return (
        f"⚠️ **Aviso Regulatório (Anvisa / Farmácia Responsável)**\n\n"
        f"Sua mensagem envolve **{categoria}** (identificamos: `{gatilho}`), "
        f"um tema que **não pode** ser tratado por este assistente.\n\n"
        f"Este assistente **não substitui** consulta médica, não diagnostica, "
        f"não prescreve e não orienta dosagem. Procure um profissional de "
        f"sáude habilitado.\n\n"
        f"**AO PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO.**"
    )
