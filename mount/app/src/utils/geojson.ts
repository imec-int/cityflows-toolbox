import {
  FeatureCollection,
  GeoJSON,
  LineString,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson'

// TODO: 'point' and 'coords' ar invalid GeoJson!! -> fix on server!
export type InvalidPointGeometry = {
  type: 'point' // fixme: should be 'Point'
  coords: Point['coordinates'] // fixme: should be 'coordinates'
  coordinates?: Point['coordinates']
}

/**
 * Returns all the coordinates (Points) of a given geometry in a flat Position array.
 * @param geometry
 */
export function getGeometryPositions(geometry: GeoJSON): Position[] {
  switch (geometry.type) {
    case 'Point':
      // leaflet uses [lat, lon] instead of [lon, lat] (geojson standard), so we need to reverse it!
      return [[...(geometry as Point).coordinates].reverse()]
    case 'LineString':
      return (geometry as LineString).coordinates
    case 'Polygon':
      // exterior ring
      return (geometry as Polygon).coordinates[0]
    case 'MultiPolygon':
      // exterior ring of each Polygon
      return (geometry as MultiPolygon).coordinates.flatMap(
        (polygonCoordinates) =>
          getGeometryPositions({
            type: 'Polygon',
            coordinates: polygonCoordinates,
          })
      )
    case 'Feature':
      return getGeometryPositions(geometry.geometry as GeoJSON)
    case 'FeatureCollection':
      return (geometry as FeatureCollection).features.flatMap((f) =>
        getGeometryPositions(f.geometry)
      )
    default:
      console.warn(`Unsupported geometry ${geometry.type}`)
      return []
  }
}
