import { indexLens } from 'utils/lenses';

class Program {
  constructor(commands) {
    this.commands = commands;
    this.length = commands.length;
  }
  static empty() {
    return new Program([]);
  }

  append(command) {
    return new Program(this.commands.concat(command));
  }
  set(lens, newCommand) {
    const commands = lens.set(this.commands, newCommand);
    return new Program(commands);
  }

  lines() {
    return this.commands.map((command,i) => ({
      command,
      lens: indexLens(i)
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

export default Program.empty;
