import type { Opaque } from './types'
import type { AuthState } from '../store/auth'
import { BACKEND_URL, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from '../constants'

const OAUTH_DOMAIN = BACKEND_URL
const TOKEN_PATH = '/o/token/'
const OAUTH_TOKEN_ENDPOINT = `${OAUTH_DOMAIN}${TOKEN_PATH}`

const PERSISTENT_KEYS = {
  refresh_token: 'refresh_token',
}

export type Credentials = {
  username: string
  password: string
}

export type RefreshToken = Opaque<string, 'RefreshToken'>
export type AccessToken = Opaque<string, 'AccessToken'>

export function loadAuthStateFromLocalStorage(): Partial<AuthState> {
  return {
    // refresh token is better saved in an httpOnly cookie
    refresh_token: (localStorage.getItem(PERSISTENT_KEYS.refresh_token) ??
      '') as RefreshToken,
  }
}

export function persistRefreshToken(refresh_token: RefreshToken) {
  localStorage.setItem(PERSISTENT_KEYS.refresh_token, refresh_token)
}

export function cleanupPersistentToken() {
  localStorage.removeItem(PERSISTENT_KEYS.refresh_token)
}

export async function loginRequest({ username, password }: Credentials) {
  return fetch(OAUTH_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username,
      password,
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
    }).toString(),
  })
}

export async function refreshTokensRequest(refresh_token: RefreshToken) {
  return fetch(OAUTH_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
    }).toString(),
  })
}
