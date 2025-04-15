interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string;
  // add more env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
