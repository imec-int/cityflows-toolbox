import drawLocales, { Language } from 'leaflet-draw-locales'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import nl from './locales/nl.json'

export const resources = {
  en,
  nl,
}

export type SupportedLanguage = keyof typeof resources

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = Object.keys(
  resources
) as unknown[] as SupportedLanguage[]

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    // TODO: move translations to the BE
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false, // react is already safe from xss
    },
  })

export const setupLeafletDrawLocalization = () => {
  const { language, t } = i18n

  // default leaflet-draw-locales localization
  drawLocales(language as Language)

  // app-specific overrides
  const localization = window.L.drawLocal
  localization.draw.toolbar.buttons = {
    ...localization.draw.toolbar.buttons,
    polygon: t('sensorMap.polygonSelection.buttonDraw', { type: 'Polygon' }),
    rectangle: t('sensorMap.polygonSelection.buttonDraw', { type: 'Box' }),
  }
}

export default i18n
