import {
  Credentials,
  loginRequest,
  RefreshToken,
  refreshTokensRequest,
} from '../../utils'
import { AppDispatch } from '../index'
import { AuthState, logout, setLoginError, setTokens } from './slice'
import i18n from '../../i18n'

type TokenResponseSuccess = Pick<
  AuthState,
  'access_token' | 'refresh_token'
> & {
  expires_in: number
}

type TokenResponseError = {
  error: string
  error_description: string
}

type TokenResponse = TokenResponseSuccess | TokenResponseError

export const login =
  (credentials: Credentials) => async (dispatch: AppDispatch) => {
    let loginError: string = ''
    const genericErrorMsg = i18n.t('network.error.generic')
    const getLoginErrorMessage = (status: number) => {
      switch (status) {
        case 400:
          return i18n.t('network.error.invalidCredentials')

        default:
          return i18n.t('network.error.generic')
      }
    }
    try {
      const response = await loginRequest(credentials)
      const loginResponse = (await response.json()) as TokenResponse

      const errorResponse = loginResponse as TokenResponseError

      if (errorResponse.error || errorResponse.error_description) {
        loginError = getLoginErrorMessage(response.status)
      } else {
        dispatch(setAutoTokenRefresh(loginResponse as TokenResponseSuccess))
      }
    } catch (e) {
      loginError = genericErrorMsg
    }
    dispatch(setLoginError(loginError))
  }

export const refreshTokens =
  (refresh_token: RefreshToken) => async (dispatch: AppDispatch) => {
    try {
      const response = await refreshTokensRequest(refresh_token)
      const refreshTokenResponse = (await response.json()) as TokenResponse
      const tokenResponseError = refreshTokenResponse as TokenResponseError

      if (!tokenResponseError.error) {
        dispatch(
          setAutoTokenRefresh(refreshTokenResponse as TokenResponseSuccess)
        )
      } else {
        dispatch(logout())
      }
    } catch (e) {
      dispatch(logout())
    }
  }

export const setAutoTokenRefresh = (() => {
  let expirationTimeout: ReturnType<typeof setTimeout>
  let valid_until: number
  return ({ access_token, refresh_token, expires_in }: TokenResponseSuccess) =>
    (dispatch: AppDispatch) => {
      clearTimeout(expirationTimeout)
      if (access_token && expires_in) {
        // 'expires_in' is in seconds
        valid_until = new Date().getTime() + expires_in * 1000

        // refresh tokens about one minute before access_token expires
        const timeoutMS = valid_until - new Date().getTime() - 60 * 60
        expirationTimeout = setTimeout(
          () => dispatch(refreshTokens(refresh_token)),
          timeoutMS
        )
      }

      dispatch(
        setTokens({
          access_token,
          refresh_token,
          valid_until,
        })
      )
    }
})()
