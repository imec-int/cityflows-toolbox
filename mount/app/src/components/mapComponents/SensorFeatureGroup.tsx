import { useRef } from 'react'
import { FeatureGroup } from 'react-leaflet'
import { FeatureGroup as LeafletFeatureGroup, LatLngBounds } from 'leaflet'

import { SensorFeature, SensorFeatureProps } from './SensorFeature'
import { getSensorsMeta, SensorMetaMap } from '../../utils'
import type { Sensor } from '../../store/CFState'

export type SensorFeatureGroupProps = Pick<
  SensorFeatureProps,
  'onFeatureClick' | 'featureHighlight'
> & {
  sensors: Sensor[]
  onBounds?: (bounds: LatLngBounds) => void
  metaMap?: SensorMetaMap
}

/**
 * Renders a collection of GeoJson sensor data as Features.
 *
 * By default, sensor features are highlighted if the sensor is selected or the
 * feature is being hovered over. This can be disabled via the `featureHighlight`
 * prop.
 * @returns {JSX.Element}
 * @constructor
 */
function SensorFeatureGroup({
  sensors = [],
  onBounds,
  metaMap = {},
  ...sensorFeatureProps
}: SensorFeatureGroupProps) {
  const fgRef = useRef<LeafletFeatureGroup>(null)
  const previousBoundsRef = useRef<LatLngBounds>()

  function onFeatureAdded() {
    if (onBounds) {
      const newBounds = fgRef.current?.getBounds()
      const previousBounds = previousBoundsRef.current ?? []
      if (
        newBounds &&
        newBounds.isValid() &&
        !newBounds.equals(previousBounds)
      ) {
        onBounds(newBounds)
        previousBoundsRef.current = newBounds
      }
    }
  }

  return (
    <FeatureGroup
      ref={fgRef}
      eventHandlers={{
        add: onFeatureAdded,
      }}
    >
      {sensors.map((sensor) => (
        <SensorFeature
          key={sensor.ref}
          {...sensorFeatureProps}
          sensor={sensor}
          meta={getSensorsMeta(sensor, metaMap)}
        />
      ))}
    </FeatureGroup>
  )
}

export { SensorFeatureGroup }
