import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { refreshTokens } from './store/auth'
import { useAppDispatch, useAuth } from './hooks'

import MapBrowserPage from './components/pages/MapBrowserPage'

export function App() {
  const dispatch = useAppDispatch()
  const { refresh_token } = useAuth()

  useEffect(() => {
    // on app init, fetch a new access_token using refresh_token from localstorage
    if (refresh_token) {
      dispatch(refreshTokens(refresh_token))
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapBrowserPage />} />
      </Routes>
    </Router>
  )
}
