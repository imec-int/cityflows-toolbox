import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  MapContainer as LeafletMapContainer,
  MapContainerProps as LeafletMapContainerProps,
  TileLayer,
  ZoomControl,
} from 'react-leaflet'

import { PolygonPane } from './panes/PolygonPane'
import { FeatureCollectionPane } from './panes/FeatureCollectionPane'
import { INITIAL_MAP_CONFIG } from '../../constants'
const { zoom, center } = INITIAL_MAP_CONFIG

/**
 * Wraps a Leaflet MapContainer to support custom features and configuration.
 * @param children
 * @param mapContainerProps all props supported by Leaflet's original MapContainer
 * @returns {JSX.Element}
 * @constructor
 */
export const MapContainer: React.FC<LeafletMapContainerProps> = ({
  children,
  ...mapContainerProps
}) => {
  const { t } = useTranslation()

  return (
    <LeafletMapContainer
      className="MapContainer"
      center={center}
      zoomControl={false}
      zoom={zoom}
      {...mapContainerProps}
    >
      <ZoomControl
        zoomInTitle={t('map.zoomIn')}
        zoomOutTitle={t('map.zoomOut')}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={t('map.tileSet')}
      />
      <PolygonPane />
      <FeatureCollectionPane />
      {children}
    </LeafletMapContainer>
  )
}
