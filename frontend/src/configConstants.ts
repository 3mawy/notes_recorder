// constants.ts

// Use import.meta.env for Vite environments if available
const viteEnv = typeof import.meta !== "undefined" ? import.meta.env : undefined;

//Use Vite config only in Dev mode. Otherwise, use the injected configuration from windows.config
const isUseViteConfig = viteEnv?.DEV === true;

// For environments where window.config might be defined (e.g., CI, QA, Prod)
declare const window: Window &
  typeof globalThis & {
    config?: ImportMetaEnv;
  };

const constants = {
  VITE_NOTES_BASE_URL:
    (isUseViteConfig && viteEnv?.VITE_NOTES_BASE_URL) || window.config?.VITE_NOTES_BASE_URL || "",
  VITE_IS_AUTH_DISABLED: (isUseViteConfig && viteEnv?.VITE_IS_AUTH_DISABLED) || "false",
};

export default constants;
