/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WS_ENDPOINT: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
