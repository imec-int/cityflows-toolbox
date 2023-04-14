import React from 'react'
import { GeoJSON, Tooltip } from 'react-leaflet'
import L, {
  GeoJSON as GeoJSONFeature,
  LatLngExpression,
  Layer,
  LeafletMouseEvent,
  PathOptions,
} from 'leaflet'
import { Feature, Point } from 'geojson'

import { useMutableCallback } from '../../hooks'
import { POLYGON_PANE } from './panes/PolygonPane'
import {
  getFeatureColor,
  getSensorGeometry,
  getStrokeDashArray,
  SensorMeta,
} from '../../utils'
import { Sensor } from '../../store/CFState'
import { FEATURE_COLLECTION_PANE } from './panes/FeatureCollectionPane'

const DEFAULT_FEATURE_STYLES: PathOptions = {
  weight: 7,
  color: '#3388ff',
  fillRule: 'evenodd',
  lineCap: 'square',
  fillOpacity: 0.2,
}

const SENSOR_FEATURE_STYLES = {
  default: DEFAULT_FEATURE_STYLES,
  highlighted: {
    ...DEFAULT_FEATURE_STYLES,
    color: 'yellow',
  },
}

export type SensorFeatureProps = {
  sensor: Sensor
  onFeatureClick?: (sensor: Sensor) => void
  meta: SensorMeta
  featureHighlight?: boolean
}

export const SensorFeature: React.FC<SensorFeatureProps> = ({
  sensor,
  onFeatureClick,
  meta,
  featureHighlight = true,
}) => {
  const isHighlighted = featureHighlight && !!sensor.selected

  const geoJsonData = getSensorGeometry(sensor)

  const highlightFeature = useMutableCallback(
    (e: LeafletMouseEvent) => {
      if (featureHighlight) {
        const feature = e.target as GeoJSONFeature
        feature.setStyle(SENSOR_FEATURE_STYLES.highlighted)
        feature.bringToFront()
      }
    },
    [featureHighlight]
  )

  const resetHighlight = useMutableCallback(
    (e: LeafletMouseEvent) => {
      if (featureHighlight && !sensor.selected) {
        const feature = e.target as GeoJSONFeature
        feature.setStyle(SENSOR_FEATURE_STYLES.default)
        feature.bringToBack()
      }
    },
    [sensor]
  )

  function onEachFeature(feature: Feature, layer: Layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => onFeatureClick?.(sensor),
    })
  }

  function pointToLayer() {
    return L.circle((geoJsonData as Point).coordinates as LatLngExpression, {
      radius: 10,
    })
  }

  return (
    <GeoJSON
      key={sensor.ref}
      pointToLayer={pointToLayer}
      style={
        {
          ...DEFAULT_FEATURE_STYLES,
          color: getFeatureColor(meta) ?? DEFAULT_FEATURE_STYLES.color,
          dashArray: getStrokeDashArray(sensor),
          ...(isHighlighted ? SENSOR_FEATURE_STYLES.highlighted : {}),
        } as PathOptions
      }
      data={geoJsonData}
      onEachFeature={onEachFeature}
      pane={
        geoJsonData.type === 'FeatureCollection'
          ? FEATURE_COLLECTION_PANE
          : (geoJsonData as Feature).geometry?.type === 'Polygon'
          ? POLYGON_PANE
          : undefined // use default one
      }
    >
      <Tooltip direction="top" offset={[0, -10]} sticky>
        <h4>{sensor.sensorType.name}</h4>
        <span>{sensor.ref}</span>
        {sensor.extraFields?.addressString ? (
          <div>{sensor.extraFields.addressString}</div>
        ) : null}
        {meta?.detailsString ? (
          <p className="details withLineBreaksConversion">{meta.detailsString}</p>
        ) : null}
      </Tooltip>
    </GeoJSON>
  )
}
