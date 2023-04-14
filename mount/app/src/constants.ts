import { LatLngTuple } from 'leaflet'

import { MapContainerProps as LeafletMapContainerProps } from 'react-leaflet/lib/MapContainer'
import { TimePeriodFromJSON } from './store/CFState'

type MAP_CONFIG = Pick<LeafletMapContainerProps, 'zoom'> & {
  center: LatLngTuple
}

type CustomProcessEnv = {
  REACT_APP_BACKEND_URL: string
  REACT_APP_OAUTH_CLIENT_ID: string
  REACT_APP_OAUTH_CLIENT_SECRET: string
  REACT_APP_INITIAL_MAP_CONFIG_JSON: string
  REACT_APP_INITIAL_TIME_WINDOWS: string
}

type ENVIRONMENT_VARIABLE = keyof CustomProcessEnv

function getStringVar(name: ENVIRONMENT_VARIABLE) {
  return ((process.env as CustomProcessEnv)[name] || '').trim()
}

function getJSONVar(name: ENVIRONMENT_VARIABLE) {
  let parsed
  try {
    parsed = JSON.parse(getStringVar(name))
  } catch (e) {
    // log when not in production?
  }
  return parsed ?? {}
}

export const BACKEND_URL = getStringVar('REACT_APP_BACKEND_URL').replace(
  /\/+$/g,
  ''
)

export const INITIAL_MAP_CONFIG: MAP_CONFIG = (() => {
  const env = getJSONVar('REACT_APP_INITIAL_MAP_CONFIG_JSON')
  const defaultMapConfig = {
    zoom: 14,
    center: [50.8476, 4.3572], // somewhere in Brussels
  }
  return {
    ...defaultMapConfig,
    ...env,
  }
})()

export const OAUTH_CLIENT_ID = getStringVar('REACT_APP_OAUTH_CLIENT_ID')

export const OAUTH_CLIENT_SECRET = getStringVar('REACT_APP_OAUTH_CLIENT_SECRET')

export const INITIAL_TIME_WINDOWS = (() => {
  const timeWindows = getJSONVar('REACT_APP_INITIAL_TIME_WINDOWS')
  return (Array.isArray(timeWindows) ? timeWindows : []) as TimePeriodFromJSON[]
})()
