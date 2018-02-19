import { idLens, composeLens, propertyLens, indexLens } from 'utils/lenses';
import { fromIterable, flatMap } from 'utils/generators';

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
const emptyScope = {};
const addToScope  = (scope, bindings) => scope; //eslint-disable-line
const findInScope = (scope, name) => 10; //eslint-disable-line

//Run
const runProgram = (program) => runBlock(emptyCursor, emptyScope)(program);
const runBlock = (cursor, scope) => ({bindings, commands}) => {
  const newScope = addToScope(scope, bindings);
  const runCursor = (cursor) => {
    const command = cursor.lens.get(commands);
    const result  = evaluateExpr(cursor, newScope)(command);
    return result.output;
  };

  return flatMap(runCursor, cursor.commands(commands));
};

//Evaluate
const evaluateExpr = (cursor, scope) => (expr) => {
  const evaluateConst = ({value}) => ({ value, output: [] });
  const evaluateApp   = (expr) => {
    const func = evaluateExpr(cursor, scope)(expr.func);
    const args = expr.args.map(evaluateExpr(scope));
    return substitute(cursor, scope)(func.value, args.map(arg => arg.value));
  };

  switch(expr.type) {
    case 'Expr.Prim':  return expr;
    case 'Expr.Const': return evaluateConst(expr);
    case 'Expr.App':   return evaluateApp(expr);
    case 'Expr.Var':   return findInScope(scope, expr.name);
    //TODO: lambda expressions
    // case 'Expr.Lam':   return expr;
  }
};
const evaluatePrim = (cursor) => (prim, args) => {
  const evaluateMove = () => {
    const move = { type: 'move', distance: args[0] };
    return { value: null, output: [{ cursor, mark: move }] };
  };
  const evaluateTurn = () => {
    const turn = { type: 'turn', degrees: args[0] };
    return { value: null, output: [{ cursor, mark: turn }] };
  };

  switch(prim.type) {
    case 'Prim.Move': return evaluateMove();
    case 'Prim.Turn': return evaluateTurn();
  }
};
const substitute = (cursor, scope) => (expr, args) => {
  switch(expr.type) {
    case 'Expr.Prim':
      return evaluatePrim(cursor, scope)(expr.prim, args[0]);
    //TODO: lambda expressions
    // case 'Expr.Lam':
    //   return ...;
  }
};

export default runProgram;
