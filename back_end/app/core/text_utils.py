"""Utilidades de texto: normalização e limpeza de HTML.

Extraído da célula 2 do notebook (Estação 2).
"""
import re
import unicodedata
from typing import Optional

from bs4 import BeautifulSoup


def normaliza(txt: Optional[str]) -> str:
    """Remove acento e caixa para regras determinísticas."""
    if not isinstance(txt, str):
        return ""
    txt = unicodedata.normalize("NFKD", txt)
    return "".join(c for c in txt if not unicodedata.combining(c)).lower()


def clean_html(text: Optional[str]) -> str:
    """Remove HTML e normaliza espaços."""
    if text is None or text == "":
        return ""
    try:
        texto = BeautifulSoup(str(text), "html.parser").get_text(separator=" ", strip=True)
    except Exception:
        texto = str(text)
    texto = re.sub(r"\s+", " ", texto)
    return texto.strip()
