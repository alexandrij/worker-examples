import JSONFeature from 'ol/format/JSONFeature';
import { performanceDecorator } from '@worker/common';

const w = new Worker(new URL('./myworker.ts', import.meta.url));

function featureParse(data: string): JSONFeature[] {
  return JSON.parse(data);
}

const measuredFeatureParse = performanceDecorator<typeof featureParse>(
  featureParse,
  featureParse.name,
);

w.postMessage('hi');

w.onmessage = (ev) => {
  const fc = measuredFeatureParse(ev.data.features);

  console.log('transporting', performance.now() - ev.data.start);
  console.log(
    featureParse.name,
    performance.getEntriesByName(featureParse.name, 'measure')[0].duration,
  );
  console.log(fc);
};
