import {emptyLens} from 'utils/lenses';

class Trace {
  constructor(sourceRegistry, outputRegistry) {
    this.outputRegistry = outputRegistry;
    this.sourceRegistry = sourceRegistry;
  }
  static empty() {
    return new Trace({}, []);
  }

  register(sourceLens, outputLens) {
    const newOutputRegistry = sourceLens.set(this.outputRegistry, outputLens);
    const newSourceRegistry = outputLens.set(this.sourceRegistry, sourceLens);
    return new Trace(newSourceRegistry, newOutputRegistry);
  }
  getOutput(sourceLens) {
    const output = sourceLens.get(this.outputRegistry);
    return output.get
      ? output
      : emptyLens;
  }
  getSource(outputLens) {
    const source = outputLens.get(this.sourceRegistry);
    return source.get
      ? source
      : emptyLens;
  }
}

export default Trace.empty;
