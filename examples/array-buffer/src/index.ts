import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";
import { decode } from 'geobuf';
import Pbf from 'pbf';

import { performanceDecorator } from '@worker/common';

const w = new Worker(new URL('./myworker.ts', import.meta.url));

function featureParse(data: Uint8Array): GeoJSONFeatureCollection {
  return decode(new Pbf(data)) as GeoJSONFeatureCollection;
}

const measuredFeatureParse = performanceDecorator<typeof featureParse>(
  featureParse,
  featureParse.name,
);

w.postMessage('hi');

w.onmessage = (ev) => {
  const fc = measuredFeatureParse(ev.data.features);

  console.log('transporting', ev.data.start);
  console.log(
    featureParse.name,
    performance.getEntriesByName(featureParse.name, 'measure')[0].duration,
  );
  console.log(fc);
};
