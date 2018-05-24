import { fromIterable, flatMap } from 'utils/generators';
import { idLens, composeLens } from 'utils/lenses';
import { Lens } from './ast';
import Effect from './effect';

const match = (node, handlers) => handlers[node.type](node);

// Closures
const Clos = (type, data) => ({type, ...data});
Clos.Lam = ({names, expr, loc, env}) => Clos('Clos.Lam', {names, expr, loc, env});
Clos.Cmd = ({cmd, loc, env}) => Clos('Clos.Cmd', {cmd, loc, env});

// Environment
const emptyEnv = {};
const extendEnv = (env, names, values) => {
  const newEnv = Object.assign({}, env);
  for(const i in names) {
    newEnv[names[i]] = values[i];
  }
  return newEnv;
};
const lookupEnv = (env, name) => {
  const value = env[name];
  if(!value) {
    throw new Error(`Unbound variable ${name}`);
  }
  return value;
};

// Stack Trace
const emptyStack = [idLens];
const extendStackTrace = (loc1, loc2) => {
  return [...loc2, ...loc1];
};
const focusStackTrace = (loc, newLens) => {
  const [ lens, ...stack ] = loc;
  return [composeLens(lens, newLens), ...stack];
};


// Run
const runCommand = (command, env = emptyEnv, loc = emptyStack) =>
  match(command, {
    'Cmd.Move':  ({expr}) =>
      match(evaluateExpr(expr, loc, env), {
        'Expr.Const': ({value}) => {
          const effect = Effect.Move({distance: value});
          const out    = { effect, location: loc };
          return fromIterable([out]);
        }
      }),
    'Cmd.Turn':  ({expr}) =>
      match(evaluateExpr(expr, loc, env), {
        'Expr.Const': ({value}) => {
          const effect = Effect.Turn({degrees: value});
          const out    = { effect, location: loc };
          return fromIterable([out]);
        }
      }),
    'Cmd.Block': ({binds, cmds}) => {
      let newEnv = env;
      for(const i in binds) {
        const bind = binds[i];
        const newLoc = focusStackTrace(loc, Lens.Cmd.Block.bind(i));
        newEnv = evaluateDefinition(bind, newLoc, newEnv);
      }

      const run = (expr, i) => {
        const newLoc = focusStackTrace(loc, Lens.Cmd.Block.cmd(i));
        const clos   = evaluateExpr(expr, newLoc, newEnv);
        const {cmd, env, loc: closureLoc} =
          match(clos, { 'Clos.Cmd': () => clos });
        return runCommand(cmd, env, closureLoc);
      };

      return flatMap(run, cmds);
    }
  });

// Bindings
const evaluateDefinition = (defn, loc, env) =>
  match(defn, {
    'Bind.Let': ({name, expr}) => {
      const lens = Lens.Bind.Let.expr;
      const newLoc = focusStackTrace(loc, lens);
      const value = evaluateExpr(expr, newLoc, env);
      return extendEnv(env, [name], [value]);
    }
  });

// Evaluate
const evaluateExpr = (expr, loc, env) =>
  match(expr, {
    'Expr.Var':   ({name}) => lookupEnv(env, name),
    'Expr.Const': () => expr,
    'Expr.Cmd':   ({cmd}) => {
      const newLoc = focusStackTrace(loc, Lens.Expr.Cmd.cmd);
      return Clos.Cmd({cmd, loc: newLoc, env});
    },
    'Expr.Lam':   ({names, expr}) => {
      const newLoc = focusStackTrace(loc, Lens.Expr.Lam.expr);
      return Clos.Lam({names, expr, loc: newLoc, env})
    },
    'Expr.App':   ({func, args}) => {
      const funcLoc = focusStackTrace(loc, Lens.Expr.App.func);
      const {names, expr, loc: closureLoc, env: closureEnv} =
        match(evaluateExpr(func, funcLoc, env), {'Clos.Lam': lam => lam });
      const values = args.map((arg, i) => {
        const argLoc = focusStackTrace(loc, Lens.Expr.App.arg(i));
        return evaluateExpr(arg, argLoc, env);
      });

      const newEnv = extendEnv(closureEnv, names, values);
      const newLoc = extendStackTrace(loc, closureLoc);
      return evaluateExpr(expr, newLoc, newEnv);
    }
  });

const runProgram = (program) => runCommand(program);
export default runProgram;
