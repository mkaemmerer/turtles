import { idLens, composeLens, propertyLens, indexLens } from 'utils/lenses';
import { fromIterable, flatMap } from 'utils/generators';

const match = (node, handlers) => handlers[node.type](node);

//Cursor
const commandLens = (lens, index) => composeLens(
  composeLens(lens, propertyLens('commands')),
  indexLens(index)
);
const makeCursor = (lens, parent) => {
  const cursor = {
    lens,
    parent,
    commands: (commands) => fromIterable(commands.map((x,i) =>
      makeCursor(commandLens(lens, i), cursor)
    ))
  };
}
const emptyCursor = makeCursor(idLens, null);

//Scope
//TODO:
const emptyScope  = {};
const addToScope  = (scope, binding) => scope; //eslint-disable-line
const findInScope = (scope, name) => 10; //eslint-disable-line

//Run
const runProgram = (program) => runCommand(emptyScope)(program);

const runCommand = (scope) => (command) =>
  match(command, {
    'Cmd.Move':  ({amount}) =>
      match(evaluateExpr(scope)(amount), {
        'Expr.Const': ({value}) => {
          const move = { type: 'move', distance: value };
          return [{ mark: move }];
        }
      }),
    'Cmd.Turn':  ({amount}) =>
      match(evaluateExpr(scope)(amount), {
        'Expr.Const': ({value}) => {
          const turn = { type: 'turn', degrees: value };
          return [{ mark: turn }];
        }
      }),
    'Cmd.Block': ({bindings, commands}) => {
      const newScope = evaluateBindings(scope)(bindings);
      const run = (command) => {
        const result = evaluateExpr(newScope)(command);
        return match(result, {
          'Expr.Cmd': ({cmd}) => runCommand(newScope)(cmd);
        });
      };
      return flatMap(run, commands);
    }
  });

//Bindings
const evaluateBindings = (scope) => (bindings) =>
  bindings.reduce((scope, {name, expr}) => {
    const result = evaluateExpr(scope)(expr);
    return addToScope(scope, {name, result});
  }, scope);

//Evaluate
const evaluateExpr = (scope) => (expr) =>
  match(expr, {
    'Expr.Cmd':   () => expr,
    'Expr.Const': () => expr,
    'Expr.Var':   ({name}) => findInScope(scope, expr.name),
    'Expr.App':   ({func, args}) =>
      match(evaluateExpr(scope)(func), {
        'Expr.Lam': () => {
          const f  = evaluateExpr(scope)(func);
          const as = args.map(evaluateExpr(scope));
          //????
          //Create new scope
          return substitute(scope)(f.value, as.map(arg => arg.value));
        }
      }),
    // 'Expr.Lam': () => expr
  });
const substitute = (scope) => (expr, args) =>
  match(expr, {
    // 'Expr.Lam': () => {}
  });

export default runProgram;
