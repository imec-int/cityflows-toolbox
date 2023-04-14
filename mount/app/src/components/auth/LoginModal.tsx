import classnames from 'classnames'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { FaCheck } from 'react-icons/fa'

import { Spinner } from '../shared'
import { useAuth } from '../../hooks'
import { Credentials } from '../../utils'
import { LanguageSelector } from '../profile/LanguageSelector'

export function LoginModal() {
  const [isLoading, setIsLoading] = useState(false)
  const { login, loginError, refresh_token, access_token } = useAuth()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    clearErrors,
    reset: resetForm,
    formState: { errors: validationErrors },
  } = useForm<{ username: string; password: string }>()

  const onSubmit = async ({ username, password }: Credentials) => {
    clearErrors()
    setIsLoading(true)
    await login({
      username,
      password,
    })
    setIsLoading(false)
  }

  const clearFormValues = () => resetForm()

  const validationErrorMessages: string[] = Object.entries(validationErrors)
    // sort by keys alphabetically
    .sort(([key], [otherKey]) => otherKey.localeCompare(key))
    .map(([_, value]) => value.message ?? '')

  return (
    <Modal show={!refresh_token} onExited={clearFormValues} autoFocus centered>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 flex flex-col"
        onSubmit={
          refresh_token ? handleSubmit(() => {}) : handleSubmit(onSubmit)
        }
      >
        <h2 className="mb-6 text-gray-900 text-lg font-bold text-center">
          {t('auth.signIn')}
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-900 text-sm font-bold mb-2"
            htmlFor="username"
          >
            {t('auth.username')}
          </label>
          <input
            className={classnames(
              'appearance-none outline-none border rounded w-full py-2 px-3 text-gray-900',
              { 'border-danger': validationErrors.username }
            )}
            {...register('username', {
              required: t('auth.fieldIsRequired', {
                field: t('auth.username'),
              }),
            })}
            type="text"
            placeholder={t('auth.username').toLowerCase()}
          />
        </div>
        <div className="mb-6">
          <label
            className="border-red-600 block text-gray-900 text-sm font-bold mb-2"
            htmlFor="password"
          >
            {t('auth.password')}
          </label>
          <input
            className={classnames(
              'appearance-none outline-none border rounded w-full py-2 px-3 text-gray-900 mb-3',
              { 'border-danger': validationErrors.password }
            )}
            {...register('password', {
              required: t('auth.fieldIsRequired', {
                field: t('auth.password'),
              }),
            })}
            type="password"
            placeholder="**********"
          />
          {validationErrorMessages.map((errorMessage) => (
            <p className="text-red-500 text-xs italic">{errorMessage}</p>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <button
              className={classnames(
                'w-fit mb-2 bg-blue-500 text-white font-bold py-2 px-4 rounded',
                { 'hover:bg-blue-900': !access_token }
              )}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : access_token ? (
                <FaCheck />
              ) : (
                t('auth.signIn')
              )}
            </button>
            {loginError && !isLoading && (
              <p className="text-red-500 text-xs italic">{loginError}</p>
            )}
          </div>
          <LanguageSelector />
        </div>
      </form>
    </Modal>
  )
}
