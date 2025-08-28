/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_AI_FEATURES: string
  readonly VITE_ENABLE_ADMIN_PANEL: string
  readonly VITE_DEV_MODE: string
  readonly VITE_SHOW_QUERY_DEVTOOLS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
