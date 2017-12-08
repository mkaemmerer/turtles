import * as gen from './index';

class FluentGenerator {
  constructor(generator) {
    this.generator = generator;
  }
  map(f) {
    return new FluentGenerator(gen.map(f, this.generator));
  }
  forEach(f) {
    gen.forEach(f, this.generator);
  }
  scan(step, seed) {
    return new FluentGenerator(gen.scan(step, seed, this.generator));
  }
  reduce(f, acc) {
    return gen.reduce(f, acc, this.generator);
  }
  toArray() {
    return gen.toArray(this.generator);
  }
  last() {
    return gen.last(this.generator);
  }
}

export const range = (start, end) =>
  new FluentGenerator(gen.range(start, end));

export const fromIterable = (iterable) =>
  new FluentGenerator(iterable);
