import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import { FitBoundsOptions, LatLngBounds } from 'leaflet'

export const FIT_BOUNDS_OPTIONS: FitBoundsOptions = {
  padding: [30, 30],
}

export type FitToBoundsProps = {
  bounds?: LatLngBounds
}

export const FitToBounds: React.FC<FitToBoundsProps> = ({ bounds }) => {
  const map = useMap()

  useEffect(() => {
    bounds && map.fitBounds(bounds, FIT_BOUNDS_OPTIONS)
  }, [bounds, map])

  return null
}
