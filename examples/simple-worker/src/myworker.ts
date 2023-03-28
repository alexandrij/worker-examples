import { GeoJSONFeature, GeoJSONFeatureCollection } from "ol/format/GeoJSON";
import { generateLineString } from '@worker/common';

self.onmessage = (ev) => {
  console.log(ev.data);

  const fc: GeoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };
  let coord = [30, 60];
  for (let i = 0; i < 100000; i++) {
    const lineString = generateLineString(coord);
    coord = [coord[0] + 0.0005, coord[1] + 0.0005];

    const feature: GeoJSONFeature = {
      type: 'Feature',
      properties: { name: 'St.Petersburg' },
      geometry: lineString,
    };
    fc.features.push(feature);
  }
  postMessage({
    start: performance.now(),
    features: JSON.stringify(fc),
  });
};
