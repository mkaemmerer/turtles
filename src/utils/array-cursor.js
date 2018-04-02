import { emptyLens, propertyLens, safeLens } from './lenses';

const keyLens = (key) => (key === undefined)
  ? emptyLens
  : safeLens(propertyLens(key), {});

export const makeCursor = (keys, index) => {
  const key = keys[index];
  const cursor = {
    key,
    index,
    lens:             keyLens(key),
    nextSibling:      () => makeCursor(keys, index+1),
    previousSibling:  () => makeCursor(keys, index-1)
  };
  return cursor;
};

export const emptyCursor = {
  lens: emptyLens,
  nextSibling: () => emptyCursor,
  previousSibling: () => emptyCursor
};

export function* cursorRange(startCursor, endCursor) {
  const isForwards = startCursor.index < endCursor.index;

  let currentCursor = startCursor;
  yield currentCursor;
  while(currentCursor.index !== endCursor.index) {
    currentCursor = isForwards
      ? currentCursor.nextSibling()
      : currentCursor.previousSibling();
    yield currentCursor;
  }
}
