import { indexLens, propertyLens, composeLens, safeLens } from 'utils/lenses';

// AST
const Cmd = (type, data) => ({type, ...data});
Cmd.Move  = ({expr}) => Cmd('Cmd.Move', {expr});
Cmd.Turn  = ({expr}) => Cmd('Cmd.Turn', {expr});
Cmd.Block = ({binds, cmds}) => Cmd('Cmd.Block', {binds, cmds});

const Expr = (type, data) => ({type, ...data});
Expr.Cmd   = ({cmd})   => Expr('Expr.Cmd',   {cmd});
Expr.Const = ({value}) => Expr('Expr.Const', {value});
Expr.Var   = ({name})  => Expr('Expr.Var',   {name});
Expr.App   = ({func, args}) => Expr('Expr.App', {func, args});
Expr.Lam   = ({names, expr}) => Expr('Expr.Lam', {names, expr});

const Bind = (type, data) => ({type, ...data});
Bind.Let = ({name, expr}) => Bind('Bind.Let', {name, expr});

// Lenses
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


export {
  Cmd,
  Expr,
  Bind,
  Lens
};
