import { indexLens, safeLens, composeLens, propertyLens } from 'utils/lenses';
import { Command } from './ast';

const primLens     = composeLens(
  safeLens(propertyLens('data'), {}),
  propertyLens('command')
);
const sequenceLens = composeLens(
  safeLens(propertyLens('data'), { commands: [] }),
  propertyLens('commands')
);

const over = (f, lens) => (s) => {
  const x = lens.get(s);
  return lens.set(s, f(x));
}

function lines(cmd, lens) {
  return Command.match(cmd, {
    Prim(command) {
      const newLens = composeLens(lens, primLens);
      return [{ command, lens: newLens }];
    },
    Seq(cmds) {
      let ret = [];
      for(const i in cmds) {
        const cmd = cmds[i];
        const newLens = composeLens(
          composeLens(lens, sequenceLens),
          safeLens(indexLens(i), {})
        );
        const newLines = lines(cmd, newLens);
        ret = ret.concat(newLines);
      }
      return ret;
    }
  });
}

class Program {
  constructor(sequence) {
    this.sequence = sequence;
    this.length = sequence.data.commands.length;
  }
  static empty() {
    return new Program(Command.Seq([]));
  }
  static lens = {
    get(p)     { return p.sequence || Command.Seq([]); },
    set(p,seq) { return new Program(seq); },
    name: 'Program'
  }

  append(command) {
    const lens   = composeLens(Program.lens, sequenceLens);
    const append = over((commands) => commands.concat(command), lens);
    return append(this);
  }

  lines() {
    return lines(this.sequence, Program.lens);
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
