/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ENERGYGAIN_API_BASE_URL?: string;
  readonly VITE_IS_AUTH_DISABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
