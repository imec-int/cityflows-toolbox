import { useAuth } from '../../hooks'
import { useTranslation } from 'react-i18next'

export const LogoutBtn = () => {
  const { logout } = useAuth()
  const { t } = useTranslation()

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        logout()
      }}
    >
      {t('auth.signOut')}
    </button>
  )
}
