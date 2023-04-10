const LAST_POINT_KEY = 'lastPoint';

export function setLastPoint(lastPoint) {
  localStorage.setItem(LAST_POINT_KEY, JSON.stringify(lastPoint));
}

export function getLastPoint() {
  return JSON.parse(localStorage.getItem(LAST_POINT_KEY));
}