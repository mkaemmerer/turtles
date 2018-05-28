import { indexLens, propertyLens, composeLens, safeLens } from 'utils/lenses';

const safeIndexLens = (i) => safeLens(indexLens(i), {});
const Lens = {
  Cmd: {
    Move:  { expr: safeLens(propertyLens('expr'), {}) },
    Turn:  { expr: safeLens(propertyLens('expr'), {}) },
    Block: {
      binds: safeLens(propertyLens('binds'), []),
      cmds:  safeLens(propertyLens('cmds'), []),
      bind(i) { return composeLens(Lens.Cmd.Block.binds, safeIndexLens(i)); },
      cmd(i)  { return composeLens(Lens.Cmd.Block.cmds,  safeIndexLens(i)); }
    }
  },
  Expr: {
    Cmd:   { cmd:   safeLens(propertyLens('cmd'), {}) },
    Const: { value: propertyLens('value') },
    Var:   { name:  propertyLens('name') },
    App:   {
      func: safeLens(propertyLens('func'), {}),
      args: safeLens(propertyLens('args'), []),
      arg(i) { return composeLens(Lens.Expr.App.args, safeIndexLens(i)); }
    },
    Lam:   {
      names: safeLens(propertyLens('names'), []),
      expr:  safeLens(propertyLens('expr'), {}),
      name(i) { return composeLens(Lens.Expr.Lam.names, safeIndexLens(i)); }
    }
  },
  Bind: {
    Let: { name: propertyLens('name'), expr: safeLens(propertyLens('expr'), {}) }
  }
};

export default Lens;
