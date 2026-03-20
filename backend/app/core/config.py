from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "TuBarberia API"
    environment: str = "dev"
    supabase_db_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
