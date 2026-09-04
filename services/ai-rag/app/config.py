"""Service configuration. Secrets live ONLY here (server-side), never in the browser."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = ""

    llm_base_url: str | None = None
    llm_api_key: str | None = None
    llm_model: str | None = None

    embedding_base_url: str | None = None
    embedding_api_key: str | None = None
    embedding_model: str | None = None
    embedding_dimension: int = 1536

    allowed_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:4173"]

    # Abuse guards
    max_message_length: int = 4000
    max_history_size: int = 20
    max_context_size: int = 60000
    max_top_k: int = 20
    max_tool_iterations: int = 8

    # BYOK runtime LLM provider guards (user-supplied from the browser)
    max_provider_url_length: int = 500
    max_provider_name_length: int = 120
    max_provider_model_length: int = 200
    max_provider_api_key_length: int = 500
    enforce_https_providers: bool = True


settings = Settings()
