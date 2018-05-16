import { fromIterable, flatMap } from 'utils/generators';
import { Expr, Cmd, Bind } from './ast';
import Effect from './effect';

const match = (node, handlers) => handlers[node.type](node);

// Scope
const emptyScope  = {};
const makeScope   = (names, values) => {
  const scope = {};
  for(const i in names) {
    scope[names[i]] = values[i];
  }
  return scope;
};
const addToScope  = (scope, name, value) => ({
  ...scope,
  [name]: value
});
const findInScope = (scope, name) => scope[name];

// Create fresh variable names for avoiding capture
let varId = 0;
const newName = () => {
  return `$${varId++}`;
};

// Bindings
const evaluateBindings = (bindings) =>
  bindings.reduce((scope, binding) =>
    match(binding, {
      'Bind.Let': ({name, expr}) => {
        const value = evaluateExpr(substitute(scope, expr));
        return addToScope(scope, name, value);
      }
    })
  , emptyScope);

// Run
const runCommand = (command) =>
  match(command, {
    'Cmd.Move':  ({expr}) =>
      match(evaluateExpr(expr), {
        'Expr.Const': ({value}) => {
          const effect = Effect.Move({distance: value});
          const out    = { effect };
          return fromIterable([out]);
        }
      }),
    'Cmd.Turn':  ({expr}) =>
      match(evaluateExpr(expr), {
        'Expr.Const': ({value}) => {
          const effect = Effect.Turn({degrees: value});
          const out    = { effect };
          return fromIterable([out]);
        }
      }),
    'Cmd.Block': ({binds, cmds}) => {
      const scope = evaluateBindings(binds);
      const run = (expr) =>
        match(evaluateExpr(substitute(scope, expr)), {
          'Expr.Cmd': ({cmd}) => runCommand(cmd)
        });
      return flatMap(run, cmds);
    }
  });

// Evaluate
const evaluateExpr = (expr) =>
  match(expr, {
    'Expr.Var':   ({name}) => { throw new Error(`Unbound variable ${name}`) },
    'Expr.Const': () => expr,
    'Expr.Cmd':   () => expr,
    'Expr.Lam':   () => expr,
    'Expr.App':   ({func, args}) => {
      const {names, expr} = match(evaluateExpr(func), {'Expr.Lam': lam => lam });
      const values        = args.map(evaluateExpr);
      const scope         = makeScope(names, values);
      return evaluateExpr(substitute(scope, expr));
    }
  });

// Substitute variables in `expr` with the values in `scope`.
// Performs a renaming first so that only free variables will be replaced.
const substitute = (scope, expr) => unsafeSubstitute(scope, rename(expr));

// Substitute variables in `expr` with the values in `scope`.
// Unsafe, because this will replace both free and bound variables.
const unsafeSubstitute = (scope, expr) => {
  const subExpr = (expr) => match(expr, {
    'Expr.Var':   ({name}) => {
      const value = findInScope(scope, name);
      return (value === undefined)
        ? expr
        : value;
    },
    'Expr.Const': ()       => expr,
    'Expr.Cmd':   ({cmd})  => Expr.Cmd({
        cmd: subCmd(cmd)
      }),
    'Expr.Lam':   ({names, expr}) => Expr.Lam({
        names,
        expr: subExpr(expr)
      }),
    'Expr.App':   ({func, args}) => Expr.App({
        func: subExpr(func),
        args: args.map(subExpr)
      })
  });
  const subCmd = (cmd) => match(cmd, {
    'Cmd.Move':  ({expr}) => Cmd.Move({expr: subExpr(expr)}),
    'Cmd.Turn':  ({expr}) => Cmd.Turn({expr: subExpr(expr)}),
    'Cmd.Block': ({binds, cmds}) => Cmd.Block({
        binds: binds.map(subBind),
        cmds:  cmds.map(subExpr)
      })
  });
  const subBind = (bind) => match(bind, {
    'Bind.Let': ({name, expr}) => Bind.Let({
        name,
        expr: subExpr(expr)
      })
  });

  return subExpr(expr);
};

// Returns an expression that is alpha-equivalent to `expr`,
// with fresh names for all of the bound variables.
// Used before substitution to prevent capture.
const rename = (expr) => {
  const makeRenameScope = (oldNames, newNames) => {
    return makeScope(oldNames, newNames.map(name => Expr.Var({name})));
  };
  const getName = (bind) => match(bind, {
    'Bind.Let': ({name}) => name
  });

  const renameExpr = (expr) => match(expr, {
    'Expr.Var':   () => expr,
    'Expr.Const': () => expr,
    'Expr.Cmd':   ({cmd}) => Expr.Cmd({cmd: renameCmd(cmd)}),
    'Expr.Lam':   ({names, expr}) => {
      const newNames = names.map(newName);
      const scope = makeRenameScope(names, newNames);
      const newExpr = unsafeSubstitute(scope, renameExpr(expr));
      return Expr.Lam({names: newNames, expr: newExpr})
    },
    'Expr.App':   () => expr
  });
  const renameCmd = (cmd) => match(cmd, {
    'Cmd.Move':  () => cmd,
    'Cmd.Turn':  () => cmd,
    'Cmd.Block': ({binds, cmds}) => {
      const names = binds.map(getName);
      const newNames = names.map(newName);
      const scope = makeRenameScope(names, newNames);
      return Cmd.Block({
        binds: binds.map((bind, i) => renameBind(scope, newNames[i], bind)),
        cmds:  cmds.map((cmd) => unsafeSubstitute(scope, cmd))
      });
    }
  });
  const renameBind = (scope, newName, bind) => match(bind, {
    'Bind.Let': ({name, expr}) => Bind.Let({
        name,
        expr: unsafeSubstitute(scope, expr)
      })
  });

  return renameExpr(expr);
};

const runProgram = (program) => runCommand(program);
export default runProgram;
