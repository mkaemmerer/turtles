export function* range(start, end) {
  for(let i=start; i<end; i++) {
    yield i;
  }
}

export function* map(f, generator) {
  let i = 0;
  for(const x of generator) { yield f(x, i); i++; }
}

export function* flatten(generator) {
  for(const g of generator) { yield* g; }
}

export function* flatMap(f, generator) {
  let i = 0;
  for(const x of generator) { yield* f(x, i); i++; }
}

export function forEach(f, generator) {
  for(const x of generator) { f(x); }
}

export function* scan(step, seed, generator) {
  yield seed;
  for(const x of generator) {
    seed = step(seed, x);
    yield seed;
  }
}

export function reduce(f, acc, generator) {
  for(const x of generator) { acc = f(x,acc); }
  return acc;
}

export function toArray(generator) {
  return Array.from(generator);
}

export function* fromIterable(iterable) {
  for(const x of iterable) { yield x; }
}

export function last(generator) {
  let last;
  for(const x of generator) { last = x; }
  return last;
}
