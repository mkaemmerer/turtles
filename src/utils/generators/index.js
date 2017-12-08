export function* range(start, end) {
  for(let i=start; i<end; i++) {
    yield i;
  }
}

export function* map(f, generator) {
  for(const x of generator) { yield f(x); }
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
  let arr = [];
  for(const x of generator) { arr.push(x); }
  return arr;
}
