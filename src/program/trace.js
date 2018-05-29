const over = (f) => (lens, x) => lens.set(x, f(lens.get(x)));

class Trace {
  constructor(sourceRegistry, outputRegistry) {
    this.outputRegistry = outputRegistry;
    this.sourceRegistry = sourceRegistry;
  }
  static empty() {
    return new Trace({}, []);
  }

  register(location, outputLens) {
    const appendSource = over((list) => {
      const outputList = (list instanceof Array) ? list : [];
      return outputList.concat(outputLens);
    });

    const newOutputRegistry = location
      .reduce((outputRegistry, sourceLens) =>
        appendSource(sourceLens, outputRegistry),
      this.outputRegistry);
    const newSourceRegistry = outputLens.set(this.sourceRegistry, location);

    return new Trace(newSourceRegistry, newOutputRegistry);
  }
  getOutput(sourceLens) {
    const output = sourceLens.get(this.outputRegistry);
    return (output instanceof Array)
      ? output
      : [];
  }
  getSource(outputLens) {
    const source = outputLens.get(this.sourceRegistry);
    return source;
  }
}

export default Trace.empty;
