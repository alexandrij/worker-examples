import { Coordinate } from 'ol/coordinate';
import { GeoJSONLineString } from 'ol/format/GeoJSON';
import { Position } from 'geojson';

export function generateLineString(coord: Coordinate): GeoJSONLineString {
  const len = 100;
  const coords: Position[] = new Array(len);
  for (let i = 0; i < len; i++) {
    coords[i] = [coord[0] + i / len, coord[1] + i / len];
  }
  return {
    type: 'LineString',
    coordinates: coords,
  };
}
