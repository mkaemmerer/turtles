import { indexLens } from 'utils/lenses';

class Output {
  constructor(entries) {
    this.entries = entries;
  }
  static empty() {
    return new Output([]);
  }

  append(mark) {
    const i = this.entries.length;
    const lens = indexLens(i);
    const entry = { mark, lens };
    const output = new Output(this.entries.concat(entry));

    return [entry, output];
  }
}

export default Output.empty;
