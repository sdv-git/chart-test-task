export type HoverSeriesKey = 'cost' | 'roiConfirmed' | 'conversions';

export type HoverSeriesCandidate = {
  key: HoverSeriesKey;
  distance: number;
};

export const getActivationRadius = (xPositions: number[]) => {
  if (xPositions.length <= 1) {
    return 32;
  }

  const minStep = Math.min(
    ...xPositions
      .slice(1)
      .map((position, index) => position - xPositions[index])
  );

  return minStep > 0 ? minStep / 2 : 32;
};

export const findNearestDateIndex = (
  offsetX: number,
  xPositions: number[],
  activationRadius: number
) => {
  const nearest = xPositions.reduce(
    (result, position, index) => {
      const distance = Math.abs(offsetX - position);

      return distance < result.distance ? { index, distance } : result;
    },
    { index: -1, distance: Number.POSITIVE_INFINITY }
  );

  return nearest.distance <= activationRadius ? nearest.index : null;
};

export const findClosestHoverSeries = (candidates: HoverSeriesCandidate[]) => {
  if (candidates.length === 0) {
    return null;
  }

  return candidates.reduce((nearest, candidate) =>
    candidate.distance < nearest.distance ? candidate : nearest
  ).key;
};

export const isSplinePointClosest = (candidates: HoverSeriesCandidate[]) =>
  findClosestHoverSeries(candidates) === 'roiConfirmed';
