import { Pane } from 'react-leaflet'

export const FEATURE_COLLECTION_PANE = 'featureCollectionPane'

/**
 * Returns a new Pane positioned between the default pane and the Polygon pane.
 * This is intended to be used with Feature Collections so that they don't overlap
 * or cover other Features on the map.
 * Since Feature Collection may contain any type of Feature, it should be added on
 * top of the Polygon pane to avoid its non-Polygon Features being covered by the
 * Polygon pane.
 *
 * For more information on Panes see:
 * https://leafletjs.com/reference.html#map-pane
 * @returns {JSX.Element}
 * @constructor
 */
export function FeatureCollectionPane() {
  return <Pane name={FEATURE_COLLECTION_PANE} style={{ zIndex: 310 }} />
}
