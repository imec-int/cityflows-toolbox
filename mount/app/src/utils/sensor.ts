import { GeoJSON } from 'geojson'

import { getGeometryPositions } from './geojson'
import type { Sensor } from '../store/CFState'

export type SensorMetaMap = Record<string, SensorMeta>

export type SensorMeta = {
  sig: number
  nsig: number
  details: string[]
  meanDiffScore: number
  detailsHtmlString: string
  detailsString: string
  color: string
}

export function getSensorGeometry(sensor: Sensor): GeoJSON {
  return sensor.location.type === 'point'
    ? {
        ...sensor.location,
        type: 'Point',
        coordinates: sensor.location.coords ?? sensor.location.coordinates,
      }
    : sensor.location
}

export function getSensorPositions(sensor: Sensor) {
  return getGeometryPositions(getSensorGeometry(sensor))
}

export function getSensorsMeta(
  sensor: Sensor,
  meta: SensorMetaMap
): SensorMeta {
  return (meta && meta[sensor.ref]) ?? {}
}

export const getFeatureColor = (meta: SensorMeta) => {
  const colorValue = meta?.color
  return colorValue ? '#' + colorValue : null
}
export const getStrokeDashArray = (sensor: Sensor) => {
  const sensorName = sensor?.sensorType?.name
  switch (sensorName) {
    case 'SignCo':
    case 'Telraam':
      return 10

    default:
      return undefined
  }
}
