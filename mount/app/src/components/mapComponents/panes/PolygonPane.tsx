import { Pane } from 'react-leaflet'

export const POLYGON_PANE = 'polygonPane'

/**
 * Returns a new Pane positioned underneath the default Leaflet pane.
 * Intended to be used with Polygons so that they don't overlap or cover other
 * Features on the map.
 *
 * For more information see:
 * https://leafletjs.com/reference.html#map-pane
 * @returns {JSX.Element}
 * @constructor
 */
export function PolygonPane() {
  return <Pane name={POLYGON_PANE} style={{ zIndex: 300 }} />
}
