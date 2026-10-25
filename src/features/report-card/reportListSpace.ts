const ALIGNED = 1;
const REACH = 0.5;

export function listEndSpace(
  anchorTop: number | null,
  viewport: number,
  contentHeight: number,
  minimum: number,
): number {
  if (anchorTop === null) {
    return minimum;
  }
  return Math.max(minimum, anchorTop + viewport - contentHeight);
}

export function termScrollTarget(
  cardTop: number,
  offset: number,
): number | null {
  if (Math.abs(cardTop - offset) < ALIGNED) {
    return null;
  }
  return cardTop;
}

export function subjectScrollTarget(
  top: number,
  height: number,
  offset: number,
  viewport: number,
): number | null {
  if (height >= viewport) {
    return top;
  }
  const bottom = top + height;
  if (bottom > offset + viewport) {
    return bottom - viewport;
  }
  return null;
}

export function scrollOffsetReady(
  target: number,
  contentSize: number,
  viewport: number,
): boolean {
  if (viewport <= 0) {
    return false;
  }
  return target <= Math.max(0, contentSize - viewport) + REACH;
}
