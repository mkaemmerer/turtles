import { propertyLens, indexLens, composeLens } from 'utils/lenses';

const commandLens = propertyLens('command');

class Program {
  constructor(lines) {
    this.lines = lines;
  }
  append(command) {
    const i = this.lines.length;
    const lens = composeLens(indexLens(i), commandLens);
    const line = { command, lens };
    return new Program(this.lines.concat(line));
  }
  set(lens, newCommand) {
    const lines = lens.set(this.lines, newCommand);
    return new Program(lines);
  }
}

const program = () => new Program([]);
export default program;
