import { indexLens, composeLens } from 'utils/lenses';

class Program {
  constructor(commands) {
    this.commands = commands;
    this.length = commands.length;
  }
  static empty() {
    return new Program([]);
  }
  static lens = {
    get(p)    { return p.commands || []; },
    set(p,cs) { return new Program(cs); }
  }

  append(command) {
    return new Program(this.commands.concat(command));
  }

  lines() {
    return this.commands.map((command,i) => ({
      command,
      lens: composeLens(Program.lens, indexLens(i))
    }));
  }

  * interpret(state, step){
    yield state;

    for(const line of this.lines()) {
      state = step(state, line);
      yield state;
    }
  }
}

export default Program;
