import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  AccessToken,
  cleanupPersistentToken,
  goToRoot,
  loadAuthStateFromLocalStorage,
  persistRefreshToken,
  RefreshToken,
} from '../../utils'

export type AuthState = {
  access_token: AccessToken
  refresh_token: RefreshToken
  valid_until: number
  loginError: string
}

export type TokenState = Pick<
  AuthState,
  'access_token' | 'refresh_token' | 'valid_until'
>

const initialState: AuthState = {
  access_token: '' as AccessToken,
  refresh_token: '' as RefreshToken,
  valid_until: new Date().getTime(),
  loginError: '',
  ...loadAuthStateFromLocalStorage(),
}

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<TokenState>): AuthState => {
      persistRefreshToken(action.payload.refresh_token)
      return {
        ...state,
        ...action.payload,
      }
    },
    logout: (state) => {
      cleanupPersistentToken()
      goToRoot()
      return state
    },
    setLoginError: (state, action: PayloadAction<string>) => {
      state.loginError = action.payload
    },
  },
})

export default AuthSlice.reducer

export const { setTokens, setLoginError, logout } = AuthSlice.actions
