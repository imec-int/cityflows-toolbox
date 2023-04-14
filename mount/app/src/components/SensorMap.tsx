import React, { useEffect, useState } from 'react'
import { LatLngBounds } from 'leaflet'

import { MapContainer, SensorFeatureGroup } from './mapComponents'
import { FitToBounds, SensorControls } from './mapControls'
import {
  getSensorCollection,
  selectSensorCollection,
  selectVisibleSensors,
  toggleSensorSelection,
} from '../store/CFState'
import { ResetBoundsControl } from './ResetBoundsControl'
import { PolygonSelection } from './mapComponents/PolygonSelection'
import { useAppDispatch, useAppSelector, useAuth } from '../hooks'
import { UserProfile } from './profile/UserProfile'

export const SensorMap = () => {
  const dispatch = useAppDispatch()

  const sensorCollection = useAppSelector(selectSensorCollection)
  const visibleSensors = useAppSelector(selectVisibleSensors)
  const { isAuthenticated } = useAuth()

  const [featureBounds, setFeatureBounds] = useState<LatLngBounds>()

  useEffect(() => {
    isAuthenticated &&
      !sensorCollection.length &&
      dispatch(getSensorCollection())
  }, [isAuthenticated, dispatch, sensorCollection])

  return (
    <div className="SensorMap">
      <MapContainer style={{ height: '100vh', width: '100vw' }}>
        <FitToBounds bounds={featureBounds} />
        <ResetBoundsControl bounds={featureBounds} />
        <SensorFeatureGroup
          sensors={visibleSensors}
          onFeatureClick={(sensor) => {
            dispatch(toggleSensorSelection(sensor))
          }}
          onBounds={setFeatureBounds}
        />
        <PolygonSelection />
      </MapContainer>
      <SensorControls />
      <UserProfile />
    </div>
  )
}
