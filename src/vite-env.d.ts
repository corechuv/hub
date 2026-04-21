/// <reference types="vite/client" />

declare module '*.PNG' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  readonly VITE_LINK_STUDIO?: string
  readonly VITE_LINK_BOOKING?: string
  readonly VITE_LINK_ACADEMY?: string
  readonly VITE_LINK_DEVICES?: string
  readonly VITE_LINK_SHOP?: string
  readonly VITE_LINK_AI?: string
  readonly VITE_LINK_CHARITY?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_SEO_OG_IMAGE?: string
  readonly VITE_LEGAL_COMPANY?: string
  readonly VITE_LEGAL_ADDRESS?: string
  readonly VITE_LEGAL_EMAIL?: string
  readonly VITE_LEGAL_PHONE?: string
  readonly VITE_LEGAL_WEBSITE?: string
  readonly VITE_LEGAL_RESPONSIBLE_PERSON?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
