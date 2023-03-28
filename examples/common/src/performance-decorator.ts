export const performanceDecorator = function <TFunc extends (...args: any[]) => unknown>(
  func: TFunc,
  measureName: string,
): TFunc {
  return function (...args: any[]) {
    performance.mark(measureName);
    const result = func(...args);
    performance.measure(measureName, { start: measureName, end: performance.now() });
    return result;
  } as unknown as TFunc;
};
