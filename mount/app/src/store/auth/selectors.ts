import type { RootState } from '../index'
import { Selector } from '@reduxjs/toolkit'
import { AuthState } from './slice'

type AuthSelector<T> = Selector<AuthState, T>

export function selectAuthState(state: RootState) {
  return state.auth
}
