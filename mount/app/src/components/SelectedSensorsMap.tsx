import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { LatLngBounds } from 'leaflet'
import { MapContainerProps } from 'react-leaflet'

import {
  MapContainer,
  SensorFeatureGroup,
  SensorFeatureGroupProps,
} from './mapComponents'
import { selectSelectedSensors } from '../store/CFState'
import { ResetBoundsControl } from './ResetBoundsControl'
import { FitToBounds } from './mapControls/FitToBounds'

export type SelectedSensorsMapProps = MapContainerProps & {
  metaMap?: SensorFeatureGroupProps['metaMap']
}

export const SelectedSensorsMap: React.FC<SelectedSensorsMapProps> = ({
  metaMap,
  ...mapContainerProps
}) => {
  const selectedSensors = useSelector(selectSelectedSensors)

  const [featureBounds, setFeatureBounds] = useState<LatLngBounds>()

  return (
    <MapContainer
      zoomControl={false}
      doubleClickZoom={false}
      style={{ height: '200px', width: '100%' }}
      {...mapContainerProps}
    >
      <SensorFeatureGroup
        sensors={selectedSensors}
        metaMap={metaMap}
        featureHighlight={false}
        onBounds={setFeatureBounds}
      />
      <FitToBounds bounds={featureBounds} />
      <ResetBoundsControl bounds={featureBounds} />
    </MapContainer>
  )
}
