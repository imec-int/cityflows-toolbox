import {
  login as _login,
  logout as _logout,
  selectAuthState,
} from '../store/auth'
import { useAppDispatch, useAppSelector } from './redux'

import type { Credentials } from '../utils'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { access_token, refresh_token, loginError } =
    useAppSelector(selectAuthState)

  const login = (credentials: Credentials) => {
    return dispatch(_login(credentials))
  }

  const logout = () => {
    return dispatch(_logout())
  }

  return {
    isAuthenticated: !!access_token,
    access_token,
    refresh_token,
    loginError,
    login,
    logout,
  }
}
