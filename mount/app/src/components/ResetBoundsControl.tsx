import React from 'react'
import { LatLngBounds } from 'leaflet'
import { useMap } from 'react-leaflet'
import { BiTargetLock } from 'react-icons/bi'

import { FIT_BOUNDS_OPTIONS } from './mapControls'

export type ResetBoundsControlProps = {
  bounds?: LatLngBounds
}

/**
 * Displays a button in the Bottom-Right corner of the map view that will set the parent map's bounds to the given one via props.
 * @param bounds
 * @param options
 * @returns {JSX.Element}
 * @constructor
 */
export const ResetBoundsControl: React.FC<ResetBoundsControlProps> = ({
  bounds,
}) => {
  const map = useMap()

  const recenter = () => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, FIT_BOUNDS_OPTIONS)
    }
  }

  return (
    <div className="btn-leaflet-reset leaflet-bottom leaflet-right">
      <button className="leaflet-control" onClick={recenter}>
        <BiTargetLock size={20} />
      </button>
    </div>
  )
}
