export type Point = {
  x: number
  y: number
}

export type LanguageCode = 'en' | 'de' | 'uk' | 'ru'

export type CoreAreaKey =
  | 'studio'
  | 'booking'
  | 'academy'
  | 'devices'
  | 'shop'
  | 'ai'
  | 'charity'

export type LegalRoute = 'impressum' | 'privacy' | 'sitemap'
export type RouteKey = 'home' | LegalRoute

export type LocalizedArea = {
  title: string
  text: string
}

export type AreaConfig = {
  key: CoreAreaKey
  href: string
}

export type LegalSection = {
  title: string
  paragraphs: string[]
  list?: string[]
}

export type LegalPageCopy = {
  title: string
  description: string
  sections: LegalSection[]
}

export type LocalizedCopy = {
  heroTitle: string
  heroDescription: string
  openSections: string
  goCta: string
  metricsAria: string
  metrics: {
    ecosystem: string
    centerEntry: string
    access: string
  }
  language: {
    button: string
    modalTitle: string
    closeModal: string
  }
  footer: {
    legalAria: string
    socialAria: string
    legal: {
      impressum: string
      privacy: string
      sitemap: string
    }
  }
  legal: {
    updatedPrefix: string
    backHome: string
    pages: {
      impressum: LegalPageCopy
      privacy: LegalPageCopy
      sitemap: {
        title: string
        description: string
        sections: {
          center: string
          subdomains: string
          technical: string
        }
      }
    }
  }
  areas: Record<CoreAreaKey, LocalizedArea>
}
