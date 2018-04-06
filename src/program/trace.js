class Trace {
  constructor(sourceRegistry, outputRegistry) {
    this.outputRegistry = outputRegistry;
    this.sourceRegistry = sourceRegistry;
  }
  static empty() {
    return new Trace([], []);
  }

  // register(sourceLine, outputEntry) {
  //   const newOutputRegistry = sourceLine.lens.set(this.outputRegistry, outputEntry);
  //   const newSourceRegistry = outputEntry.lens.set(this.sourceRegistry, sourceLine);
  //   return new Trace(newSourceRegistry, newOutputRegistry);
  // }
  register() {
    return this;
  }
  getOutput(sourceLine) {
    return sourceLine.lens.get(this.outputRegistry);
  }
  getSource(outputEntry) {
    return outputEntry.lens.get(this.sourceRegistry);
  }
}

export default Trace.empty;
