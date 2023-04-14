import React from 'react'
import { DropdownProps, NavDropdown } from 'react-bootstrap'
import DropdownItem from 'react-bootstrap/DropdownItem'
import { useTranslation } from 'react-i18next'
import capitalize from 'lodash.capitalize'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n'

type LanguageSelectorProps = Pick<DropdownProps, 'drop'>

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ drop }) => {
  const { t } = useTranslation()

  return (
    <NavDropdown
      drop={drop}
      autoClose={'outside'}
      title={`${capitalize(t('common.language'))}`}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <LanguageOption language={lang} />
      ))}
    </NavDropdown>
  )
}

type LanguageOptionProps = {
  language: SupportedLanguage
}

const LanguageOption: React.FC<LanguageOptionProps> = ({ language }) => {
  const { i18n } = useTranslation()

  const isActiveLanguage = language === i18n.language

  const changeLanguage = () => {
    // i18n.changeLanguage(language)
    // TODO: find a way to refresh leaflet translations without reloading the page
    window.localStorage.setItem('i18nextLng', language)
    window.location.reload()
  }

  return (
    <DropdownItem
      active={isActiveLanguage}
      onClick={() => !isActiveLanguage && changeLanguage()}
    >
      {language.toUpperCase()}
    </DropdownItem>
  )
}
