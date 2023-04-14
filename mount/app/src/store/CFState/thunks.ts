import { logout, refreshTokens, selectAuthState } from '../auth'
import {
  loadDatasets,
  Modality,
  ModalityReverseCombinations,
  Sensor,
  setLoadingData,
  setMultiSourceTracks,
  SourceTracks,
  TimePeriod,
  TrackViewType,
} from './index'
import { AccessToken } from '../../utils'
import { AppDispatch, RootState } from '../index'
import { BACKEND_URL } from '../../constants'
import i18n from '../../i18n'

export enum Endpoint {
  'api' = '/api/api',
}

type ResponseStatus = 'ok' // are there other options?

type ApiResponse = { status: ResponseStatus } & {
  sensors?: Sensor[]
  sensorCards?: Sensor[]
  multiSourceTracks?: SourceTracks
}

const GLOBAL_URL = BACKEND_URL

export type RequestConfig = Exclude<RequestInit, 'body'>

function serverRequest(
  endpoint: Endpoint,
  access_token: AccessToken,
  body?: {},
  conf?: RequestConfig
) {
  return fetch(GLOBAL_URL + endpoint, {
    ...conf,
    body:
      conf?.method === 'GET'
        ? undefined
        : JSON.stringify({
            ...body,
            lang: i18n.language,
          }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    }),
  })
}

export function serverCommunication(
  endpoint: Endpoint,
  body: {},
  conf?: RequestConfig
) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoadingData(true))
    let { access_token, refresh_token } = selectAuthState(getState())
    let result
    let response: Response = await serverRequest(
      endpoint,
      access_token,
      body,
      conf
    )
    if (response.status === 403) {
      // refresh the token
      await dispatch(refreshTokens(refresh_token))
      let { access_token: refreshed_token } = selectAuthState(getState())

      // retry actual request
      response = await serverRequest(endpoint, refreshed_token, body)

      if (!response.ok) {
        // user should log in again
        dispatch(logout())
        return
      }
    }
    result = await response.json()
    dispatch(treatGenericResponse(result))
    return result
  }
}

export function treatGenericResponse(response: ApiResponse) {
  return (dispatch: AppDispatch) => {
    //if (response.error && (response.error.length > 0))
    //    dispatch(setNotification ("Error occured.", response.error))
    if (response.multiSourceTracks)
      dispatch(setMultiSourceTracks(response.multiSourceTracks))
    if (response.sensorCards) dispatch(loadDatasets(response.sensorCards))
  }
}

export function getSensorCard(ref: string) {
  return serverCommunication(
    Endpoint.api,
    { endpoint: 'getSensorCard', ref },
    {
      method: 'POST',
    }
  )
}

export function getSensorTrack(
  sensorRef: string,
  modality: Modality,
  isReverse: boolean,
  viewType: TrackViewType,
  timePeriods: TimePeriod[]
) {
  return serverCommunication(
    Endpoint.api,
    {
      endpoint: 'getSensorTrack',
      ref: sensorRef,
      modality,
      isReverse,
      viewType,
      timePeriods,
    },
    {
      method: 'POST',
    }
  )
}

export function getSensorCards(refs: string) {
  return serverCommunication(
    Endpoint.api,
    {
      endpoint: 'getSensorCards',
      refs,
    },
    {
      method: 'POST',
    }
  )
}

export function getMultiSensorTrack(
  refModalityReverseCombinations: ModalityReverseCombinations,
  viewType: TrackViewType,
  timePeriods: TimePeriod[],
  basePopulationSensorRef: string
) {
  return serverCommunication(
    Endpoint.api,
    {
      endpoint: 'getMultiSourceTrack',
      refModalityReverseCombinations,
      viewType,
      timePeriods,
      basePopulationSensorRef,
    },
    {
      method: 'POST',
    }
  )
}

export function getSensorCollection() {
  return serverCommunication(
    Endpoint.api,
    {
      endpoint: 'getSensorsCollection',
    },
    {
      method: 'POST',
    }
  )
}

export function getRawCSVData(
  refModalityReverseCombinations: ModalityReverseCombinations,
  timePeriods: TimePeriod[]
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoadingData(true))
    const { access_token } = selectAuthState(getState())
    return serverRequest(
      Endpoint.api,
      access_token,
      {
        endpoint: 'getMultiSourceTrack',
        viewType: 'extractRawCSVData',
        refModalityReverseCombinations,
        timePeriods,
      },
      {
        method: 'POST',
      }
    )
      .then((res) => {
        return res.blob()
      })
      .then((blob) => {
        const msSaveOrOpenBlob = (window.navigator as any)?.msSaveOrOpenBlob
        if (msSaveOrOpenBlob) {
          msSaveOrOpenBlob(blob, 'export.csv')
          dispatch(setLoadingData(false))
        } else {
          //other browsers
          const url = window.URL.createObjectURL(new Blob([blob]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'export.csv')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          dispatch(setLoadingData(false))
        }
      })
  }
}
