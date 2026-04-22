import { useEffect, useRef, useState } from 'react'
import './App.css'
import instagramIcon from './assets/social/instagram_white.svg?inline'
import facebookIcon from './assets/social/facebook_white_opt.png?inline'
import youtubeIcon from './assets/social/youtube_white_opt.png?inline'
import tiktokIcon from './assets/social/tiktok_white_opt.png?inline'
import whatsappIcon from './assets/social/whatsapp_white.svg?inline'
import academyLogo from './assets/logos/academy.png'
import devicesLogo from './assets/logos/devices.png'
import forLifeLogo from './assets/logos/for_life.png'
import infoCenterLogo from './assets/logos/info_center.png'
import mainLogo from './assets/logos/m.png'
import storeLogo from './assets/logos/store.png'
import studioLogo from './assets/logos/studio.png'
import supportLogo from './assets/logos/support.png'
import type {
  AreaConfig,
  LanguageCode,
  LegalRoute,
  LocalizedCopy,
  Point,
  RouteKey,
} from './types/landing'

const LANGUAGE_STORAGE_KEY = 'center-mira-language'
const LEGAL_UPDATED_AT = '2026-04-20'
const SHOW_HOME_HERO = false
const HEAD_TITLE = 'Center MiRA'

const localeByLanguage: Record<LanguageCode, string> = {
  en: 'en-US',
  de: 'de-DE',
  uk: 'uk-UA',
  ru: 'ru-RU',
}

const LANGUAGE_OPTIONS: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'uk', label: 'Українська' },
  { code: 'ru', label: 'Русский' },
]

const normalizeLanguageCode = (value: string | null | undefined): LanguageCode | null => {
  const normalized = value?.trim().toLowerCase().replace('_', '-')
  const base = normalized?.split('-')[0]

  if (base === 'ua') {
    return 'uk'
  }

  if (base === 'en' || base === 'de' || base === 'uk' || base === 'ru') {
    return base
  }

  return null
}

const getInitialLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') {
    return 'de'
  }

  const queryLanguage = normalizeLanguageCode(
    new URLSearchParams(window.location.search).get('lang'),
  )
  if (queryLanguage) {
    return queryLanguage
  }

  const storedLanguage = normalizeLanguageCode(
    window.localStorage.getItem(LANGUAGE_STORAGE_KEY),
  )
  if (storedLanguage) {
    return storedLanguage
  }

  const documentLanguage = normalizeLanguageCode(
    document.documentElement.getAttribute('lang'),
  )
  if (documentLanguage) {
    return documentLanguage
  }

  const browserLanguage = normalizeLanguageCode(window.navigator.language)
  if (browserLanguage) {
    return browserLanguage
  }

  return 'de'
}

const applyDocumentLanguage = (language: LanguageCode) => {
  if (typeof document === 'undefined') {
    return
  }

  const locale = localeByLanguage[language]
  document.documentElement.setAttribute('lang', locale)
  document.documentElement.setAttribute('xml:lang', locale)

  const contentLanguageMeta = document.querySelector('meta[name="content-language"]')
  if (contentLanguageMeta) {
    contentLanguageMeta.setAttribute('content', language)
  }
}

const normalizePathname = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

const getRouteFromPath = (): RouteKey => {
  if (typeof window === 'undefined') {
    return 'home'
  }

  const path = normalizePathname(window.location.pathname)
  if (path === '/impressum') {
    return 'impressum'
  }
  if (path === '/privacy') {
    return 'privacy'
  }
  if (path === '/sitemap') {
    return 'sitemap'
  }
  return 'home'
}

const readValue = (value: string | undefined, fallback: string) => {
  const normalized = value?.trim()
  return normalized ? normalized : fallback
}

const SITE_URL = readValue(import.meta.env.VITE_SITE_URL, 'https://center-mira.com').replace(
  /\/+$/,
  '',
)
const OG_IMAGE_URL = readValue(
  import.meta.env.VITE_SEO_OG_IMAGE,
  `${SITE_URL}/logo_full.png`,
)

const localHref = (path: string, language: LanguageCode) => {
  const url = new URL(path, SITE_URL)
  url.searchParams.set('lang', language)
  return `${url.pathname}${url.search}${url.hash}`
}

const CORE_LINKS = {
  studio: readValue(import.meta.env.VITE_LINK_STUDIO, 'https://studio.center-mira.com'),
  booking: readValue(import.meta.env.VITE_LINK_BOOKING, 'https://booking.center-mira.com'),
  academy: readValue(import.meta.env.VITE_LINK_ACADEMY, 'https://academy.center-mira.com'),
  devices: readValue(import.meta.env.VITE_LINK_DEVICES, 'https://devices.center-mira.com'),
  shop: readValue(import.meta.env.VITE_LINK_STORE, 'https://store.center-mira.com'),
  ai: readValue(import.meta.env.VITE_LINK_AI, 'https://ai.center-mira.com'),
  charity: readValue(import.meta.env.VITE_LINK_CHARITY, 'https://charity.center-mira.com'),
}

const SOCIAL_LINKS = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: readValue(import.meta.env.VITE_LINK_INSTAGRAM, 'https://instagram.com'),
    icon: instagramIcon,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: readValue(import.meta.env.VITE_LINK_FACEBOOK, 'https://facebook.com'),
    icon: facebookIcon,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    href: readValue(import.meta.env.VITE_LINK_YOUTUBE, 'https://youtube.com'),
    icon: youtubeIcon,
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    href: readValue(import.meta.env.VITE_LINK_TIKTOK, 'https://tiktok.com'),
    icon: tiktokIcon,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: readValue(import.meta.env.VITE_LINK_WHATSAPP, 'https://wa.me/'),
    icon: whatsappIcon,
  },
] as const

const EXPERIENCE_SIDE_LOGOS: Partial<
  Record<AreaConfig['key'], { label: string; src: string }>
> = {
  studio: { label: 'Studio MiRA Praxis', src: studioLogo },
  booking: { label: 'MIRA Info Center', src: infoCenterLogo },
  academy: { label: 'MIRA Academy', src: academyLogo },
  devices: { label: 'MIRA Devices', src: devicesLogo },
  shop: { label: 'MIRA Store', src: storeLogo },
  ai: { label: 'MIRA Support', src: supportLogo },
  charity: { label: 'MIRA For Life', src: forLifeLogo },
}

const CENTER_LOGO = { label: 'Center MiRA', src: mainLogo }

const LEGAL_DETAILS = {
  company: readValue(import.meta.env.VITE_LEGAL_COMPANY, HEAD_TITLE),
  address: readValue(import.meta.env.VITE_LEGAL_ADDRESS, 'Germany, European Union'),
  email: readValue(import.meta.env.VITE_LEGAL_EMAIL, 'legal@center-mira.com'),
  phone: readValue(import.meta.env.VITE_LEGAL_PHONE, '+49 176 717 668 51'),
  website: readValue(import.meta.env.VITE_LEGAL_WEBSITE, 'https://center-mira.com'),
  responsiblePerson: readValue(
    import.meta.env.VITE_LEGAL_RESPONSIBLE_PERSON,
    'Management Team, Center MiRA',
  ),
}

const AREA_ORDER = [
  'studio',
  'booking',
  'academy',
  'devices',
  'shop',
  'ai',
  'charity',
] as const

const AREA_CONFIG: AreaConfig[] = [
  { key: 'studio', href: CORE_LINKS.studio },
  { key: 'booking', href: CORE_LINKS.booking },
  { key: 'academy', href: CORE_LINKS.academy },
  { key: 'devices', href: CORE_LINKS.devices },
  { key: 'shop', href: CORE_LINKS.shop },
  { key: 'ai', href: CORE_LINKS.ai },
  { key: 'charity', href: CORE_LINKS.charity },
]

const LEGAL_LINKS: { key: LegalRoute; path: string }[] = [
  { key: 'impressum', path: '/impressum' },
  { key: 'privacy', path: '/privacy' },
  { key: 'sitemap', path: '/sitemap' },
]

const buildCablePath = (points: Point[]) => {
  if (points.length < 2) {
    return ''
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index]
    const to = points[index + 1]
    const verticalDistance = Math.abs(to.y - from.y)
    const curve = Math.max(68, Math.min(220, verticalDistance * 0.68))
    path += ` C ${from.x} ${from.y + curve}, ${to.x} ${to.y - curve}, ${to.x} ${to.y}`
  }

  return path
}

const upsertMetaTag = (
  key: 'name' | 'property',
  value: string,
  content: string,
) => {
  if (typeof document === 'undefined') {
    return
  }

  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${key}="${value}"]`,
  )
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(key, value)
    document.head.append(element)
  }
  element.setAttribute('content', content)
}

const upsertCanonicalLink = (href: string) => {
  if (typeof document === 'undefined') {
    return
  }

  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  )
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.append(element)
  }
  element.setAttribute('href', href)
}

const updateAlternateLinks = (routePath: string) => {
  if (typeof document === 'undefined') {
    return
  }

  document.head
    .querySelectorAll('link[data-seo="alternate"]')
    .forEach((node) => node.remove())

  for (const option of LANGUAGE_OPTIONS) {
    const url = new URL(routePath, SITE_URL)
    url.searchParams.set('lang', option.code)

    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', option.code)
    link.setAttribute('href', url.toString())
    link.setAttribute('data-seo', 'alternate')
    document.head.append(link)
  }

  const defaultUrl = new URL(routePath, SITE_URL)
  defaultUrl.searchParams.set('lang', 'de')
  const defaultLink = document.createElement('link')
  defaultLink.setAttribute('rel', 'alternate')
  defaultLink.setAttribute('hreflang', 'x-default')
  defaultLink.setAttribute('href', defaultUrl.toString())
  defaultLink.setAttribute('data-seo', 'alternate')
  document.head.append(defaultLink)
}

const upsertJsonLd = (payload: object) => {
  if (typeof document === 'undefined') {
    return
  }

  let element = document.head.querySelector<HTMLScriptElement>(
    'script[data-seo="jsonld"]',
  )
  if (!element) {
    element = document.createElement('script')
    element.type = 'application/ld+json'
    element.setAttribute('data-seo', 'jsonld')
    document.head.append(element)
  }

  element.textContent = JSON.stringify(payload)
}

const COPY: Record<LanguageCode, LocalizedCopy> = {
  en: {
    heroTitle: 'Center MiRA',
    heroDescription: 'System navigation map.',
    openSections: 'Open sections',
    goCta: 'Go',
    metricsAria: 'Key metrics',
    metrics: {
      ecosystem: 'ecosystem sections',
      centerEntry: 'central entry point',
      access: 'access',
    },
    language: {
      button: 'Change language',
      modalTitle: 'Interface language',
      closeModal: 'Close language selection',
    },
    footer: {
      legalAria: 'Legal navigation',
      socialAria: 'Social links',
      legal: {
        impressum: 'Legal Notice',
        privacy: 'Privacy Policy',
        sitemap: 'Site Map',
      },
    },
    legal: {
      updatedPrefix: 'Updated',
      backHome: 'Back to Center MiRA',
      pages: {
        impressum: {
          title: 'Legal Notice',
          description: 'Provider information and legal notice for Center MiRA in Germany (EU).',
          sections: [
            {
              title: 'Provider',
              paragraphs: [
                `${LEGAL_DETAILS.company}`,
                `Registered seat: ${LEGAL_DETAILS.address}`,
                'Scope of activity: digital center navigation and routing to subdomains.',
              ],
            },
            {
              title: 'Contact',
              paragraphs: [
                `Email: ${LEGAL_DETAILS.email}`,
                `Phone: ${LEGAL_DETAILS.phone}`,
                `Website: ${LEGAL_DETAILS.website}`,
              ],
            },
            {
              title: 'Responsible for content',
              paragraphs: [
                `${LEGAL_DETAILS.responsiblePerson}`,
                'Responsible under Section 18(2) MStV for editorial content (if applicable).',
              ],
            },
            {
              title: 'EU dispute resolution',
              paragraphs: [
                'The European Commission provides an ODR platform: https://ec.europa.eu/consumers/odr/',
                'We are not obliged and not willing to participate in consumer arbitration proceedings.',
              ],
            },
            {
              title: 'Liability notice',
              paragraphs: [
                'We are responsible for our own content according to general laws.',
                'External links lead to third-party content; their operators are solely responsible for that content.',
              ],
            },
          ],
        },
        privacy: {
          title: 'Privacy Policy',
          description: 'Information on personal data processing under GDPR.',
          sections: [
            {
              title: 'Controller',
              paragraphs: [
                `${LEGAL_DETAILS.company}`,
                `Data controller: ${LEGAL_DETAILS.responsiblePerson}`,
                `${LEGAL_DETAILS.address}`,
                `Contact: ${LEGAL_DETAILS.email}`,
              ],
            },
            {
              title: 'Data we process',
              paragraphs: [
                'Server log data (IP address, date/time, requested URL, User-Agent) for secure operation.',
                'Language preference in Local Storage key: center-mira-language.',
              ],
              list: [
                'No account registration on this landing page.',
                'No checkout process on this landing page.',
                'Subdomain links redirect to their own dedicated systems.',
              ],
            },
            {
              title: 'Purpose and legal basis',
              paragraphs: [
                'Service delivery and technical security: Art. 6(1)(f) GDPR.',
                'Saving the selected language for usability: Art. 6(1)(f) GDPR.',
                'If optional tracking tools are enabled in the future, consent is required under Art. 6(1)(a) GDPR and Section 25 TDDDG.',
              ],
            },
            {
              title: 'Storage and deletion',
              paragraphs: [
                'Server logs are stored only as long as needed for operations and security.',
                'The Local Storage language value remains until it is removed by the user or by a browser reset.',
              ],
            },
            {
              title: 'Your rights',
              paragraphs: [
                'You may request access, rectification, erasure, restriction, portability, and object to processing under Arts. 15–21 GDPR.',
                'You may lodge a complaint with your supervisory authority in the EU, especially in Germany where the service is operated.',
              ],
            },
          ],
        },
        sitemap: {
          title: 'Site Map',
          description: 'Complete navigation map of the center and linked subdomain systems.',
          sections: {
            center: 'Center pages',
            subdomains: 'Subdomain systems',
            technical: 'Technical endpoint',
          },
        },
      },
    },
    areas: {
      studio: {
        title: 'Studio MiRA Praxis',
        text: 'Visual showcase of the center: atmosphere, style, and service format.',
      },
      booking: {
        title: 'Booking',
        text: 'Central booking flow with a fast path to services and visit time.',
      },
      academy: {
        title: 'Academy',
        text: 'Learning and knowledge block: answers, processes, and instructions.',
      },
      devices: {
        title: 'Devices',
        text: 'Beauty salon devices: equipment catalog and working protocols.',
      },
      shop: {
        title: 'Store',
        text: 'Salon store: products, supplies, and professional essentials.',
      },
      ai: {
        title: 'AI',
        text: 'AI support module: hints, scenarios, and routine automation.',
      },
      charity: {
        title: 'Charity',
        text: 'Social initiatives of the center: support for projects and community programs.',
      },
    },
  },
  de: {
    heroTitle: 'Center MiRA',
    heroDescription: 'Navigationskarte des Systems.',
    openSections: 'Bereiche öffnen',
    goCta: 'Weiter',
    metricsAria: 'Zentrale Kennzahlen',
    metrics: {
      ecosystem: 'Teile des Ökosystems',
      centerEntry: 'zentraler Einstieg',
      access: 'Zugang',
    },
    language: {
      button: 'Sprache wechseln',
      modalTitle: 'Sprache der Oberfläche',
      closeModal: 'Sprachauswahl schließen',
    },
    footer: {
      legalAria: 'Rechtliche Navigation',
      socialAria: 'Soziale Links',
      legal: {
        impressum: 'Impressum',
        privacy: 'Datenschutzerklärung',
        sitemap: 'Sitemap',
      },
    },
    legal: {
      updatedPrefix: 'Stand',
      backHome: 'Zurück zum Center MiRA',
      pages: {
        impressum: {
          title: 'Impressum',
          description:
            'Anbieterkennzeichnung für Center MiRA in Deutschland (EU).',
          sections: [
            {
              title: 'Diensteanbieter',
              paragraphs: [
                `${LEGAL_DETAILS.company}`,
                `Sitz: ${LEGAL_DETAILS.address}`,
                'Tätigkeitsbereich: digitale Zentrumsnavigation und Weiterleitung zu Subdomains.',
              ],
            },
            {
              title: 'Kontakt',
              paragraphs: [
                `E-Mail: ${LEGAL_DETAILS.email}`,
                `Telefon: ${LEGAL_DETAILS.phone}`,
                `Website: ${LEGAL_DETAILS.website}`,
              ],
            },
            {
              title: 'Verantwortlich für Inhalte',
              paragraphs: [
                `${LEGAL_DETAILS.responsiblePerson}`,
                'Verantwortlich gemäß § 18 Abs. 2 MStV für redaktionelle Inhalte (soweit vorhanden).',
              ],
            },
            {
              title: 'EU-Streitbeilegung',
              paragraphs: [
                'Plattform der EU-Kommission zur Online-Streitbeilegung: https://ec.europa.eu/consumers/odr/',
                'Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
              ],
            },
            {
              title: 'Haftungshinweis',
              paragraphs: [
                'Für eigene Inhalte sind wir nach den allgemeinen Gesetzen verantwortlich.',
                'Für Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich.',
              ],
            },
          ],
        },
        privacy: {
          title: 'Datenschutzerklärung',
          description:
            'Hinweise zur Verarbeitung personenbezogener Daten nach DSGVO.',
          sections: [
            {
              title: 'Verantwortlicher',
              paragraphs: [
                `${LEGAL_DETAILS.company}`,
                `Verantwortliche Person: ${LEGAL_DETAILS.responsiblePerson}`,
                `${LEGAL_DETAILS.address}`,
                `Kontakt: ${LEGAL_DETAILS.email}`,
              ],
            },
            {
              title: 'Verarbeitete Daten',
              paragraphs: [
                'Server-Logdaten (IP-Adresse, Datum/Uhrzeit, aufgerufene URL, User-Agent) zur technischen Bereitstellung und Sicherheit.',
                'Sprachauswahl im Local Storage unter dem Schlüssel center-mira-language.',
              ],
              list: [
                'Keine Kontoanlage auf dieser Landingpage.',
                'Kein Checkout auf dieser Landingpage.',
                'Weiterleitungen zu Subdomains erfolgen in eigenständige Systeme.',
              ],
            },
            {
              title: 'Zweck und Rechtsgrundlage',
              paragraphs: [
                'Technischer Betrieb und Sicherheit: Art. 6 Abs. 1 lit. f DSGVO.',
                'Merken der Spracheinstellung für bessere Nutzbarkeit: Art. 6 Abs. 1 lit. f DSGVO.',
                'Bei optionalen Tracking-Tools ist zusätzlich eine Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 TDDDG erforderlich.',
              ],
            },
            {
              title: 'Speicherdauer',
              paragraphs: [
                'Server-Logs werden nur so lange gespeichert, wie es für Betrieb und Sicherheit notwendig ist.',
                'Der Local-Storage-Eintrag zur Sprache bleibt bis zur Löschung durch den Nutzer oder Browser-Reset.',
              ],
            },
            {
              title: 'Ihre Rechte',
              paragraphs: [
                'Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO).',
                'Sie können sich bei einer Datenschutzaufsichtsbehörde in der EU beschweren, insbesondere in Deutschland.',
              ],
            },
          ],
        },
        sitemap: {
          title: 'Sitemap',
          description:
            'Vollständige Navigationskarte des Zentrums und der verlinkten Subdomain-Systeme.',
          sections: {
            center: 'Center-Seiten',
            subdomains: 'Subdomain-Systeme',
            technical: 'Technischer Endpunkt',
          },
        },
      },
    },
    areas: {
      studio: {
        title: 'Studio MiRA Praxis',
        text: 'Visuelle Präsentation des Zentrums: Atmosphäre, Stil und Serviceformat.',
      },
      booking: {
        title: 'Booking',
        text: 'Zentrale Buchung mit schnellem Einstieg zu Services und Besuchszeit.',
      },
      academy: {
        title: 'Academy',
        text: 'Lern- und Wissensbereich: Antworten, Prozesse und Anleitungen.',
      },
      devices: {
        title: 'Devices',
        text: 'Geräte für den Beauty-Salon: Katalog der Ausstattung und Arbeitsprotokolle.',
      },
      shop: {
        title: 'Store',
        text: 'Salon-Store: Produkte, Verbrauchsmaterialien und professionelle Artikel.',
      },
      ai: {
        title: 'AI',
        text: 'AI-Modul zur Unterstützung: Hinweise, Szenarien und Automatisierung von Routinen.',
      },
      charity: {
        title: 'Wohltätigkeit',
        text: 'Soziale Initiativen des Zentrums: Projektförderung und Teilnahme an Programmen.',
      },
    },
  },
  uk: {
    heroTitle: 'Center MiRA',
    heroDescription: 'Навігаційна карта системи.',
    openSections: 'Відкрити розділи',
    goCta: 'Перейти',
    metricsAria: 'Ключові показники',
    metrics: {
      ecosystem: 'частин екосистеми',
      centerEntry: 'центральний вхід',
      access: 'доступ',
    },
    language: {
      button: 'Зміна мови',
      modalTitle: 'Мова інтерфейсу',
      closeModal: 'Закрити вибір мови',
    },
    footer: {
      legalAria: 'Юридична навігація',
      socialAria: 'Посилання на соцмережі',
      legal: {
        impressum: 'Правова інформація',
        privacy: 'Політика приватності',
        sitemap: 'Карта сайту',
      },
    },
    legal: {
      updatedPrefix: 'Оновлено',
      backHome: 'Повернутися до Center MiRA',
      pages: {
        impressum: {
          title: 'Правова інформація',
          description:
            'Правова інформація про постачальника сервісу Center MiRA у Німеччині (ЄС).',
          sections: [
            {
              title: 'Постачальник послуг',
              paragraphs: [
                `${LEGAL_DETAILS.company}`,
                `Місцезнаходження: ${LEGAL_DETAILS.address}`,
                'Сфера діяльності: цифрова навігація центру та переходи до субдоменних систем.',
              ],
            },
            {
              title: 'Контакти',
              paragraphs: [
                `Email: ${LEGAL_DETAILS.email}`,
                `Телефон: ${LEGAL_DETAILS.phone}`,
                `Сайт: ${LEGAL_DETAILS.website}`,
              ],
            },
            {
              title: 'Відповідальний за контент',
              paragraphs: [
                `${LEGAL_DETAILS.responsiblePerson}`,
                'Відповідальна особа за редакційний контент (за наявності) визначається згідно з § 18 Abs. 2 MStV.',
              ],
            },
            {
              title: 'Врегулювання спорів в ЄС',
              paragraphs: [
                'Платформа ODR Європейської Комісії: https://ec.europa.eu/consumers/odr/',
                'Ми не зобовʼязані та не готові брати участь у процедурі споживчого арбітражу.',
              ],
            },
            {
              title: 'Застереження щодо відповідальності',
              paragraphs: [
                'За власний контент ми відповідаємо відповідно до загального законодавства.',
                'За вміст зовнішніх посилань відповідають виключно їхні оператори.',
              ],
            },
          ],
        },
        privacy: {
          title: 'Політика приватності',
          description:
            'Інформація про обробку персональних даних відповідно до GDPR.',
          sections: [
            {
              title: 'Володілець даних',
              paragraphs: [
                `${LEGAL_DETAILS.company}`,
                `Відповідальна особа: ${LEGAL_DETAILS.responsiblePerson}`,
                `${LEGAL_DETAILS.address}`,
                `Контакт: ${LEGAL_DETAILS.email}`,
              ],
            },
            {
              title: 'Які дані обробляються',
              paragraphs: [
                'Логи сервера (IP, дата/час, URL запиту, user-agent) для безпеки та стабільної роботи.',
                'Налаштування мови в local storage за ключем center-mira-language.',
              ],
              list: [
                'На цій сторінці немає реєстрації акаунта.',
                'На цій сторінці немає процесу оплати.',
                'Переходи на субдомени ведуть у незалежні системи.',
              ],
            },
            {
              title: 'Мета та правові підстави',
              paragraphs: [
                'Технічне надання сервісу та безпека: Art. 6(1)(f) GDPR.',
                'Збереження вибраної мови для зручності: Art. 6(1)(f) GDPR.',
                'Якщо в майбутньому буде підключено необовʼязкові трекери, потрібна згода за Art. 6(1)(a) GDPR та § 25 TDDDG.',
              ],
            },
            {
              title: 'Строки зберігання',
              paragraphs: [
                'Логи сервера зберігаються лише на період, необхідний для роботи та безпеки.',
                'Значення мови в local storage зберігається до видалення користувачем або очищення браузера.',
              ],
            },
            {
              title: 'Ваші права',
              paragraphs: [
                'Ви маєте право на доступ, виправлення, видалення, обмеження, перенесення даних і заперечення (Art. 15–21 GDPR).',
                'Ви можете подати скаргу до наглядового органу з захисту даних в ЄС, зокрема в Німеччині.',
              ],
            },
          ],
        },
        sitemap: {
          title: 'Карта сайту',
          description: 'Повна карта навігації центру та підключених субдоменів.',
          sections: {
            center: 'Сторінки центру',
            subdomains: 'Субдоменні системи',
            technical: 'Технічна точка',
          },
        },
      },
    },
    areas: {
      studio: {
        title: 'Studio MiRA Praxis',
        text: 'Візуальна вітрина центру: атмосфера, стиль і сервісний формат.',
      },
      booking: {
        title: 'Booking',
        text: 'Центральний запис зі швидким переходом до послуг і часу візиту.',
      },
      academy: {
        title: 'Academy',
        text: 'Блок навчання та знань: відповіді, процеси та інструкції.',
      },
      devices: {
        title: 'Devices',
        text: 'Апарати для салону краси: каталог обладнання та робочі протоколи.',
      },
      shop: {
        title: 'Store',
        text: 'Магазин для салону: товари, витратні матеріали та професійні позиції.',
      },
      ai: {
        title: 'AI',
        text: 'AI-модуль для асистування: підказки, сценарії й автоматизація рутини.',
      },
      charity: {
        title: 'Благодійність',
        text: 'Соціальні ініціативи центру: підтримка проєктів і участь у добрих програмах.',
      },
    },
  },
  ru: {
    heroTitle: 'Center MiRA',
    heroDescription: 'Навигационная карта системы.',
    openSections: 'Открыть разделы',
    goCta: 'Перейти',
    metricsAria: 'Ключевые показатели',
    metrics: {
      ecosystem: 'частей экосистемы',
      centerEntry: 'центральный вход',
      access: 'доступ',
    },
    language: {
      button: 'Смена языка',
      modalTitle: 'Язык интерфейса',
      closeModal: 'Закрыть выбор языка',
    },
    footer: {
      legalAria: 'Юридическая навигация',
      socialAria: 'Ссылки на соцсети',
      legal: {
        impressum: 'Правовая информация',
        privacy: 'Политика конфиденциальности',
        sitemap: 'Карта сайта',
      },
    },
    legal: {
      updatedPrefix: 'Обновлено',
      backHome: 'Вернуться в Center MiRA',
      pages: {
        impressum: {
          title: 'Правовая информация',
          description:
            'Правовая информация о поставщике сервиса Center MiRA в Германии (ЕС).',
          sections: [
            {
              title: 'Поставщик услуг',
              paragraphs: [
                `${LEGAL_DETAILS.company}`,
                `Местонахождение: ${LEGAL_DETAILS.address}`,
                'Сфера деятельности: цифровая навигация центра и переходы в субдоменные системы.',
              ],
            },
            {
              title: 'Контакты',
              paragraphs: [
                `Email: ${LEGAL_DETAILS.email}`,
                `Телефон: ${LEGAL_DETAILS.phone}`,
                `Сайт: ${LEGAL_DETAILS.website}`,
              ],
            },
            {
              title: 'Ответственный за контент',
              paragraphs: [
                `${LEGAL_DETAILS.responsiblePerson}`,
                'Ответственный за редакционные материалы (при наличии) определяется в соответствии с § 18 Abs. 2 MStV.',
              ],
            },
            {
              title: 'Разрешение споров в ЕС',
              paragraphs: [
                'Платформа ODR Европейской Комиссии: https://ec.europa.eu/consumers/odr/',
                'Мы не обязаны и не готовы участвовать в процедурах потребительского арбитража.',
              ],
            },
            {
              title: 'Ограничение ответственности',
              paragraphs: [
                'За собственный контент мы отвечаем в соответствии с общими законами.',
                'За содержание внешних ссылок отвечают исключительно их операторы.',
              ],
            },
          ],
        },
        privacy: {
          title: 'Политика конфиденциальности',
          description:
            'Информация об обработке персональных данных по GDPR.',
          sections: [
            {
              title: 'Оператор данных',
              paragraphs: [
                `${LEGAL_DETAILS.company}`,
                `Ответственное лицо: ${LEGAL_DETAILS.responsiblePerson}`,
                `${LEGAL_DETAILS.address}`,
                `Контакт: ${LEGAL_DETAILS.email}`,
              ],
            },
            {
              title: 'Какие данные обрабатываются',
              paragraphs: [
                'Серверные логи (IP-адрес, дата/время, URL запроса, user-agent) для безопасности и стабильной работы.',
                'Выбор языка сохраняется в local storage под ключом center-mira-language.',
              ],
              list: [
                'На этом лендинге нет регистрации аккаунтов.',
                'На этом лендинге нет оплаты услуг.',
                'Переходы на субдомены ведут в отдельные системы.',
              ],
            },
            {
              title: 'Цели и правовые основания',
              paragraphs: [
                'Техническая работа сервиса и безопасность: Art. 6(1)(f) GDPR.',
                'Сохранение выбранного языка для удобства: Art. 6(1)(f) GDPR.',
                'При подключении необязательных трекеров требуется согласие по Art. 6(1)(a) GDPR и § 25 TDDDG.',
              ],
            },
            {
              title: 'Сроки хранения',
              paragraphs: [
                'Серверные логи хранятся только на срок, необходимый для работы и безопасности.',
                'Значение языка в local storage хранится до удаления пользователем или очистки браузера.',
              ],
            },
            {
              title: 'Права пользователя',
              paragraphs: [
                'Вы имеете право на доступ, исправление, удаление, ограничение, перенос данных и возражение (Art. 15–21 GDPR).',
                'Вы можете подать жалобу в надзорный орган по защите данных в ЕС, в том числе в Германии.',
              ],
            },
          ],
        },
        sitemap: {
          title: 'Карта сайта',
          description: 'Полная карта навигации центра и подключенных субдоменов.',
          sections: {
            center: 'Страницы центра',
            subdomains: 'Субдоменные системы',
            technical: 'Техническая точка',
          },
        },
      },
    },
    areas: {
      studio: {
        title: 'Studio MiRA Praxis',
        text: 'Визуальная витрина центра: атмосфера, оформление и сервисный формат.',
      },
      booking: {
        title: 'Booking',
        text: 'Центральная запись с быстрым переходом к услугам и времени визита.',
      },
      academy: {
        title: 'Academy',
        text: 'Блок обучения и знаний: ответы на вопросы, процессы и инструкции.',
      },
      devices: {
        title: 'Devices',
        text: 'Аппараты для салона красоты: каталог оборудования и рабочих протоколов.',
      },
      shop: {
        title: 'Store',
        text: 'Магазин для салона: товары, расходники и профессиональные позиции.',
      },
      ai: {
        title: 'AI',
        text: 'AI-модуль для ассистирования: подсказки, сценарии и автоматизация рутины.',
      },
      charity: {
        title: 'Благотворительность',
        text: 'Социальные инициативы центра: поддержка проектов и участие в добрых программах.',
      },
    },
  },
}

function App() {
  const route = getRouteFromPath()
  const isHomePage = route === 'home'
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage)
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLAnchorElement | null>(null)
  const cardRefs = useRef<Record<string, HTMLElement | null>>({})
  const [cablePath, setCablePath] = useState<string>('')
  const [cableViewport, setCableViewport] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  })

  useEffect(() => {
    applyDocumentLanguage(language)
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    if (!isLanguageModalOpen || typeof window === 'undefined') {
      return
    }

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageModalOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isLanguageModalOpen])

  useEffect(() => {
    if (!isHomePage) {
      return
    }

    let frameId = 0
    let observer: ResizeObserver | null = null

    const updateCable = () => {
      const content = contentRef.current
      const logo = logoRef.current

      if (!content || !logo) {
        return
      }

      const contentRect = content.getBoundingClientRect()
      const logoRect = logo.getBoundingClientRect()

      const points: Point[] = [
        {
          x: logoRect.left - contentRect.left + logoRect.width / 2,
          y: logoRect.bottom - contentRect.top,
        },
      ]

      for (const key of AREA_ORDER) {
        const card = cardRefs.current[key]
        if (!card) {
          return
        }
        const cardRect = card.getBoundingClientRect()
        points.push({
          x: cardRect.left - contentRect.left + cardRect.width / 2,
          y: cardRect.top - contentRect.top + Math.min(26, cardRect.height * 0.22),
        })
      }

      const path = buildCablePath(points)
      const maxY = Math.max(...points.map((point) => point.y)) + 40
      setCablePath(path)
      setCableViewport({
        width: Math.max(1, Math.ceil(contentRect.width)),
        height: Math.max(Math.ceil(contentRect.height), Math.ceil(maxY)),
      })
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(updateCable)
    }

    scheduleUpdate()
    window.addEventListener('resize', scheduleUpdate)

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(scheduleUpdate)
      const observedElements = [
        contentRef.current,
        logoRef.current,
        ...AREA_ORDER.map((key) => cardRefs.current[key]),
      ]
      observedElements.forEach((element) => {
        if (element) {
          observer?.observe(element)
        }
      })
    }

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', scheduleUpdate)
      observer?.disconnect()
    }
  }, [isHomePage])

  const copy = COPY[language]
  const areas = AREA_CONFIG.map((item) => ({
    ...item,
    title: copy.areas[item.key].title,
    text: copy.areas[item.key].text,
    cta: copy.goCta,
  }))

  const updatedAt = new Intl.DateTimeFormat(localeByLanguage[language], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(LEGAL_UPDATED_AT))

  const legalPage = route === 'impressum'
    ? copy.legal.pages.impressum
    : route === 'privacy'
      ? copy.legal.pages.privacy
      : null

  const routePath = route === 'home' ? '/' : `/${route}`
  const pageTitle = route === 'home'
    ? copy.heroTitle
    : route === 'impressum'
      ? copy.legal.pages.impressum.title
      : route === 'privacy'
        ? copy.legal.pages.privacy.title
        : copy.legal.pages.sitemap.title
  const pageDescription = route === 'home'
    ? copy.heroDescription
    : route === 'impressum'
      ? copy.legal.pages.impressum.description
      : route === 'privacy'
        ? copy.legal.pages.privacy.description
        : copy.legal.pages.sitemap.description

  const pageKeywords = Array.from(
    new Set(
      (
        route === 'home'
          ? [
              LEGAL_DETAILS.company,
              copy.heroTitle,
              ...areas.map((item) => item.title),
              copy.footer.legal.impressum,
              copy.footer.legal.privacy,
              copy.footer.legal.sitemap,
            ]
          : [
              LEGAL_DETAILS.company,
              pageTitle,
              copy.footer.legal.impressum,
              copy.footer.legal.privacy,
              copy.footer.legal.sitemap,
            ]
      ).filter((item) => item.trim().length > 0),
    ),
  ).join(', ')

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const fullTitle = HEAD_TITLE
    const canonical = new URL(routePath, SITE_URL)
    canonical.searchParams.set('lang', language)
    const canonicalHref = canonical.toString()
    const ogLocale = localeByLanguage[language].replace('-', '_')

    document.title = fullTitle

    upsertMetaTag('name', 'description', pageDescription)
    upsertMetaTag('name', 'keywords', pageKeywords)
    upsertMetaTag(
      'name',
      'robots',
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    )
    upsertMetaTag('name', 'author', LEGAL_DETAILS.company)
    upsertMetaTag('name', 'content-language', language)

    upsertMetaTag('property', 'og:type', 'website')
    upsertMetaTag('property', 'og:site_name', LEGAL_DETAILS.company)
    upsertMetaTag('property', 'og:title', fullTitle)
    upsertMetaTag('property', 'og:description', pageDescription)
    upsertMetaTag('property', 'og:url', canonicalHref)
    upsertMetaTag('property', 'og:image', OG_IMAGE_URL)
    upsertMetaTag('property', 'og:locale', ogLocale)

    upsertMetaTag('name', 'twitter:card', 'summary_large_image')
    upsertMetaTag('name', 'twitter:title', fullTitle)
    upsertMetaTag('name', 'twitter:description', pageDescription)
    upsertMetaTag('name', 'twitter:image', OG_IMAGE_URL)

    upsertCanonicalLink(canonicalHref)
    updateAlternateLinks(routePath)

    upsertJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: LEGAL_DETAILS.company,
          url: SITE_URL,
          email: LEGAL_DETAILS.email,
          telephone: LEGAL_DETAILS.phone,
          founder: LEGAL_DETAILS.responsiblePerson,
          address: {
            '@type': 'PostalAddress',
            streetAddress: LEGAL_DETAILS.address,
            addressCountry: 'DE',
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: LEGAL_DETAILS.company,
          inLanguage: localeByLanguage[language],
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/?lang=${language}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalHref}#webpage`,
          url: canonicalHref,
          name: pageTitle,
          description: pageDescription,
          inLanguage: localeByLanguage[language],
          isPartOf: {
            '@id': `${SITE_URL}/#website`,
          },
          about: {
            '@id': `${SITE_URL}/#organization`,
          },
        },
      ],
    })
  }, [language, pageDescription, pageKeywords, pageTitle, routePath])

  const applyLanguageAndReload = (nextLanguage: LanguageCode) => {
    if (typeof window === 'undefined') {
      setLanguage(nextLanguage)
      setIsLanguageModalOpen(false)
      return
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.set('lang', nextLanguage)
    window.location.assign(nextUrl.toString())
  }

  const renderFooter = () => (
    <footer className="landing-footer">
      <div className="landing-footer__content">
        <nav className="landing-footer__legal" aria-label={copy.footer.legalAria}>
          {LEGAL_LINKS.map((item) => (
            <a
              key={item.key}
              href={localHref(item.path, language)}
              className={item.key === route ? 'is-active' : undefined}
            >
              {copy.footer.legal[item.key]}
            </a>
          ))}
        </nav>

        <button
          className="pill-link pill-link--ghost landing-language-toggle"
          type="button"
          onClick={() => setIsLanguageModalOpen(true)}
          aria-label={copy.language.button}
          aria-haspopup="dialog"
          aria-expanded={isLanguageModalOpen}
        >
          {copy.language.button}
        </button>

        <span className="landing-footer__corp">
          © {new Date().getFullYear()} {LEGAL_DETAILS.company}
        </span>
      </div>
    </footer>
  )

  const renderLanguageModal = () =>
    isLanguageModalOpen ? (
      <div
        className="landing-language-modal-overlay"
        role="presentation"
        onClick={() => setIsLanguageModalOpen(false)}
      >
        <div
          className="landing-language-modal"
          role="dialog"
          aria-modal="true"
          aria-label={copy.language.modalTitle}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="landing-language-modal__head">
            <strong>{copy.language.modalTitle}</strong>
            <button
              type="button"
              className="landing-language-modal__close"
              onClick={() => setIsLanguageModalOpen(false)}
              aria-label={copy.language.closeModal}
            >
              ×
            </button>
          </div>

          <div className="landing-language-modal__list">
            {LANGUAGE_OPTIONS.map((item) => (
              <button
                key={item.code}
                type="button"
                className={
                  item.code === language
                    ? 'landing-language-modal__option is-active'
                    : 'landing-language-modal__option'
                }
                onClick={() => {
                  applyLanguageAndReload(item.code)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    ) : null

  if (!isHomePage) {
    const sitemapCopy = copy.legal.pages.sitemap

    const sitemapCenterLinks = [
      { label: copy.heroTitle, href: localHref('/', language), external: false },
      {
        label: copy.footer.legal.impressum,
        href: localHref('/impressum', language),
        external: false,
      },
      {
        label: copy.footer.legal.privacy,
        href: localHref('/privacy', language),
        external: false,
      },
      {
        label: copy.footer.legal.sitemap,
        href: localHref('/sitemap', language),
        external: false,
      },
    ]

    const sitemapSubdomainLinks = areas.map((item) => ({
      label: item.title,
      href: item.href,
      external: true,
    }))

    const sitemapTechLinks = [
      { label: 'sitemap.xml', href: '/sitemap.xml', external: false },
    ]

    return (
      <main className="landing-page" translate="no">
        <div className="landing-page__content" ref={contentRef}>
          <header className="landing-nav">
            <a
              className="landing-brand"
              href={localHref('/', language)}
              aria-label="MIRA CENTER home"
              ref={logoRef}
            >
              <img className="landing-brand__logo" src={mainLogo} alt="Center MiRA logo" />
            </a>
          </header>

          <section className="legal-page-view">
            <div className="legal-page-view__hero">
              <p className="legal-page-view__eyebrow">LEGAL</p>
              <h1>
                {route === 'sitemap' ? sitemapCopy.title : legalPage?.title}
              </h1>
              <p>
                {route === 'sitemap' ? sitemapCopy.description : legalPage?.description}
              </p>
              <a className="pill-link pill-link--ghost" href={localHref('/', language)}>
                {copy.legal.backHome}
              </a>
            </div>

            <section className="legal-page-view__content">
              <p className="legal-page-view__updated">
                {copy.legal.updatedPrefix}: {updatedAt}
              </p>

              {route === 'sitemap' ? (
                <>
                  <article className="legal-page-view__section">
                    <h2>{sitemapCopy.sections.center}</h2>
                    <ul className="legal-page-view__list">
                      {sitemapCenterLinks.map((link) => (
                        <li key={link.href}>
                          <a href={link.href}>{link.label}</a>
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className="legal-page-view__section">
                    <h2>{sitemapCopy.sections.subdomains}</h2>
                    <ul className="legal-page-view__list">
                      {sitemapSubdomainLinks.map((link) => (
                        <li key={link.href}>
                          <a href={link.href} rel="noreferrer" target="_blank">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className="legal-page-view__section">
                    <h2>{sitemapCopy.sections.technical}</h2>
                    <ul className="legal-page-view__list">
                      {sitemapTechLinks.map((link) => (
                        <li key={link.href}>
                          <a href={link.href}>{link.label}</a>
                        </li>
                      ))}
                    </ul>
                  </article>
                </>
              ) : (
                legalPage?.sections.map((section) => (
                  <article className="legal-page-view__section" key={section.title}>
                    <h2>{section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={`${section.title}-${paragraph}`}>{paragraph}</p>
                    ))}
                    {section.list ? (
                      <ul className="legal-page-view__list">
                        {section.list.map((entry) => (
                          <li key={`${section.title}-${entry}`}>{entry}</li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))
              )}
            </section>
          </section>

          {renderFooter()}
        </div>

        {renderLanguageModal()}
      </main>
    )
  }

  return (
    <main className="landing-page" translate="no">
      <div className="landing-page__content" ref={contentRef}>
        <header className="landing-nav">
          <a className="landing-brand" href={localHref('/', language)} aria-label="MIRA CENTER home" ref={logoRef}>
            <img className="landing-brand__logo" src={mainLogo} alt="Center MiRA logo" />
          </a>
        </header>

        {cablePath ? (
          <svg
            className="landing-cable"
            viewBox={`0 0 ${cableViewport.width} ${cableViewport.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="landing-cable__flow landing-cable__flow--slow" d={cablePath} pathLength={1000} />
            <path className="landing-cable__flow landing-cable__flow--fast" d={cablePath} pathLength={1000} />
          </svg>
        ) : null}

        {SHOW_HOME_HERO ? (
          <section className="landing-hero" id="top">
            <div className="landing-hero__copy">
              <h1 className="landing-hero__title">{copy.heroTitle}</h1>
              <p className="landing-hero__description">{copy.heroDescription}</p>

              <div className="landing-hero__cta">
                <a href="#core" className="pill-link pill-link--ghost">
                  {copy.openSections}
                </a>
              </div>
            </div>

            <ul className="landing-metrics" aria-label={copy.metricsAria}>
              <li>
                <strong>9</strong>
                <span>{copy.metrics.ecosystem}</span>
              </li>
              <li>
                <strong>1</strong>
                <span>{copy.metrics.centerEntry}</span>
              </li>
              <li>
                <strong>24/7</strong>
                <span>{copy.metrics.access}</span>
              </li>
              <li className="landing-metrics__qr">
                <img
                  src="/center-mira-qrcode.svg"
                  alt="Center MiRA QR code"
                  loading="lazy"
                  decoding="async"
                />
              </li>
            </ul>
          </section>
        ) : null}

        <section className="experience-grid" id="core">
          {areas.map((item, index) => {
            const sideLogo = EXPERIENCE_SIDE_LOGOS[item.key]
            const ctaLogo = sideLogo ?? CENTER_LOGO

            return (
              <article
                key={item.key}
                className={`experience-card experience-card--${item.key}${
                  sideLogo ? ' experience-card--with-feature-logo' : ''
                }`}
                ref={(node) => {
                  cardRefs.current[item.key] = node
                }}
              >
                <span className="experience-card__index">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="experience-card__content">
                  <h2 className="experience-card__title">{item.title}</h2>
                  <span className="experience-card__text">{item.text}</span>
                  <a
                    className="pill-link pill-link--ghost"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.cta}
                  </a>
                </div>

                <a
                  className={`experience-card__feature-logo${
                    sideLogo ? '' : ' experience-card__feature-logo--mobile-only'
                  }`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${item.cta}: ${item.title}`}
                  title={ctaLogo.label}
                >
                  <img
                    src={ctaLogo.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </article>
            )
          })}
        </section>

        <nav className="landing-social" aria-label={copy.footer.socialAria}>
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.key}
              className={`landing-social__link landing-social__link--${item.key}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={item.label}
            >
              <img
                className={`landing-social__icon landing-social__icon--${item.key}`}
                src={item.icon}
                alt={item.label}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
            </a>
          ))}
        </nav>

        {renderFooter()}
      </div>

      {renderLanguageModal()}
    </main>
  )
}

export default App
