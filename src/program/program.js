import { propertyLens, indexLens, composeLens } from 'utils/lenses';

const commandLens = propertyLens('command');

class Program {
  constructor(lines) {
    this.lines = lines;
  }
  static empty() {
    return new Program([]);
  }

  append(command) {
    const i = this.lines.length;
    const lens = indexLens(i);
    const line = { command, lens };
    const program = new Program(this.lines.concat(line));

    return [line, program];
  }
  set(lens, newCommand) {
    const lines = composeLens(lens, commandLens).set(this.lines, newCommand);
    return new Program(lines);
  }

  * interpret(state, step){
    yield state;

    for(const line of this.lines) {
      state = step(state, line);
      yield state;
    }
  }
}

export default Program.empty;
