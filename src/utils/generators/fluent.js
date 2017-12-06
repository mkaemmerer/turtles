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
  reduce(f, acc) {
    return gen.reduce(f, acc, this.generator);
  }
  toArray() {
    return gen.toArray(this.generator);
  }
}

export const range = (start, end) =>
  new FluentGenerator(gen.range(start, end));
