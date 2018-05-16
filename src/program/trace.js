class Trace {
  constructor(sourceRegistry, outputRegistry) {
    this.outputRegistry = outputRegistry;
    this.sourceRegistry = sourceRegistry;
  }
  static empty() {
    return new Trace([], []);
  }

  register(sourceLens, outputLens) {
    const newOutputRegistry = sourceLens.set(this.outputRegistry, outputLens);
    const newSourceRegistry = outputLens.set(this.sourceRegistry, sourceLens);
    return new Trace(newSourceRegistry, newOutputRegistry);
  }
  getOutput(sourceLens) {
    return sourceLens.get(this.outputRegistry);
  }
  getSource(outputLens) {
    return outputLens.get(this.sourceRegistry);
  }
}

export default Trace.empty;
