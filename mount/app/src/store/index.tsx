import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth'
import cfReducer from './CFState'

const store = configureStore({
  reducer: {
    cf: cfReducer,
    auth: authReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
