import { useRef } from 'react'
import { FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import isInPolygon from '@turf/boolean-point-in-polygon'
import { DrawEvents, FeatureGroup as LeafletFeatureGroup } from 'leaflet'
import { Polygon } from 'geojson'

import { selectVisibleSensors, setSelectedSensors } from '../../store/CFState'
import { useAppDispatch, useAppSelector, useMutableCallback } from '../../hooks'
import { getSensorPositions } from '../../utils'

export function PolygonSelection() {
  const dispatch = useAppDispatch()

  const fgRef = useRef<LeafletFeatureGroup>(null)
  const visibleSensors = useAppSelector(selectVisibleSensors)

  const onPolygonFilterCreated = useMutableCallback(
    (e: DrawEvents.Created) => {
      if (fgRef.current) {
        const polygonLayer = e.layer
        filterSensors(polygonLayer.toGeoJSON())
        fgRef.current.removeLayer(polygonLayer)
      }
    },
    [filterSensors]
  )

  function filterSensors(polygon: Polygon) {
    const selectedSensors = visibleSensors.filter((sensor) => {
      const sensorCoordinates = getSensorPositions(sensor)
      return (
        sensorCoordinates.length &&
        sensorCoordinates.every((point) => isInPolygon(point, polygon))
      )
    })

    dispatch(setSelectedSensors(selectedSensors))
  }

  return (
    <FeatureGroup ref={fgRef}>
      <EditControl
        position={'topleft'}
        onCreated={onPolygonFilterCreated}
        edit={{ remove: false, edit: false }}
        draw={{
          polygon: true,
          rectangle: true,
          marker: false,
          circle: false,
          circlemarker: false,
          polyline: false,
        }}
      />
    </FeatureGroup>
  )
}
