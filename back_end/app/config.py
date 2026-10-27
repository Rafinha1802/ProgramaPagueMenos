"""Configuração centralizada via variáveis de ambiente.

Usa pydantic-settings para validar tipos na subida do servidor.
Se faltar variável obrigatória, o servidor NÃO SOBE — falha cedo.
"""
import os
from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Tenta importar com segurança o gerenciador de segredos do Colab
try:
    from google.colab import userdata
    colab_openai_key = userdata.get('OPENAI_API_KEY')
except Exception:
    colab_openai_key = ""

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- app ---
    app_name: str = "Pague Menos IA Commerce"
    app_version: str = "0.1.0"
    log_level: str = "info"

    # --- CORS ---
    cors_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,https://programa-pague-menos.vercel.app",
        description="Origens permitidas, separadas por vírgula",
    )

    # --- dados ---
    catalog_path: str = "data/paguemenos_catalog.parquet"

    # --- RAG ---
    embedding_backend: str = "auto"  # auto | tfidf | sentence
    embedding_model: str = "all-MiniLM-L6-v2"
    rag_top_k: int = 10

    # --- LLM e Provedores de IA ---
    openai_api_key: str = colab_openai_key or os.getenv("OPENAI_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    huggingface_api_key: str = os.getenv("HUGGINGFACE_API_KEY", "")

    llm_provider: str = "auto"  # auto | gemini | groq | openai | free | local
    llm_model: str = "auto"     # auto | gemini-1.5-flash | llama-3.3-70b-versatile | gpt-4o-mini
    llm_enabled: bool = True    # Ativado para rodar com IA real e contextual

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
