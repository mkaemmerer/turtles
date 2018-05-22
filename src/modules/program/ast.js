import React from 'react';
import { indexLens, propertyLens, composeLens, idLens } from 'utils/lenses';
import Number from 'components/number';
import { indent, concat, str, seq, intersperse, newline, Doc } from 'lang/doc';

import styles from './ast.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const match = (node, handlers) => handlers[node.type](node);

const lenses = {
  cmd: {
    move:  { expr: propertyLens('expr') },
    turn:  { expr: propertyLens('expr') },
    block: {
      binds: propertyLens('binds'),
      cmds: propertyLens('cmds'),
      bind(i) { return composeLens(lenses.cmd.block.binds, indexLens(i)); },
      cmd(i)  { return composeLens(lenses.cmd.block.cmds,  indexLens(i)); }
    }
  },
  expr: {
    cmd:   { cmd: propertyLens('cmd') },
    const: { value: propertyLens('value') },
    var:   { name: propertyLens('name') },
    app:   {
      func: propertyLens('func'),
      args: propertyLens('args'),
      arg(i) { return composeLens(lenses.expr.app.args, indexLens(i)); }
    },
    lam:   {
      names: propertyLens('names'),
      expr: propertyLens('expr'),
      name(i) { return composeLens(lenses.expr.lam.names, indexLens(i)); }
    }
  },
  bind: {
    let: { name: propertyLens('name'), expr: propertyLens('expr') }
  }
};


// Tokens
const Var = ({children}) => (
  <span className={cx('variable')}>{children}</span>
);
const Const = ({children}) => (
  <span className={cx('constant')}>{children}</span>
);

// Block
const printBlock = (props, block, lens = idLens) => {
  const binds = block.binds.map((bind, i) => {
    const bindLens = composeLens(lens, lenses.cmd.block.bind(i));
    return printBind(props, bind, bindLens);
  });
  const cmds  = block.cmds.map((cmd, i) => {
    const cmdLens = composeLens(lens, lenses.cmd.block.cmd(i));
    return printExpr(props, cmd, cmdLens);
  });

  const bindPart = (binds.length > 0)
    ? concat(intersperse(binds, newline), newline)
    : Doc.Empty;
  const cmdPart = intersperse(cmds, newline);
  return seq([bindPart, cmdPart, newline]);
};

// Command
const printCmd = (props, cmd, lens) =>
  match(cmd, {
    'Cmd.Move':  () => printCmdMove(props, cmd, lens),
    'Cmd.Turn':  () => printCmdTurn(props, cmd, lens),
    'Cmd.Block': () => printCmdBlock(props, cmd, lens)
  });
const printCmdMove = (props, cmd, lens) => {
  const exprLens = composeLens(lens, lenses.cmd.move.expr);
  return seq([
    str('move'),
    str('('),
    printExpr({kind: 'distance', ...props}, cmd.expr, exprLens),
    str(')')
  ]);
};
const printCmdTurn = (props, cmd, lens) => {
  const exprLens = composeLens(lens, lenses.cmd.turn.expr);
  return seq([
    str('turn'),
    str('('),
    printExpr({kind: 'degrees', ...props}, cmd.expr, exprLens),
    str(')')
  ]);
};
const printCmdBlock = (props, cmd, lens) => {
  return seq([
    str('do'),
    indent(concat(newline, printBlock(props, cmd, lens)))
  ]);
};

// Expression
const printExpr = (props, expr, lens) =>
  match(expr, {
    'Expr.Var':   () => printExprVar(props, expr, lens),
    'Expr.Const': () => printExprConst(props, expr, lens),
    'Expr.Cmd':   () => printExprCmd(props, expr, lens),
    'Expr.Lam':   () => printExprLam(props, expr, lens),
    'Expr.App':   () => printExprApp(props, expr, lens)
  });
const printExprVar = (props, expr) => {
  return str(<Var>{expr.name}</Var>);
};
const printExprConst = (props, expr, lens) => {
  const constLens = composeLens(lens, lenses.expr.const.value);
  const onDragStart = props.kind === 'degrees'
    ? props.onDegreesDragStart
    : props.onDistanceDragStart;
  const onDragEnd = props.kind === 'degrees'
    ? props.onDegreesDragEnd
    : props.onDistanceDragEnd;
  const increment = props.kind === 'degrees' ? 15 : 10;

  return str(
    <Const>
      <Number
        value={expr.value}
        increment={increment}
        scaleFactor={0.1}
        onChange={(value) => { props.onChange(value, constLens); }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </Const>
  );
};
const printExprCmd = (props, expr, lens) => {
  const cmdLens = composeLens(lens, lenses.expr.cmd.cmd);
  return printCmd(props, expr.cmd, cmdLens);
};
const printExprLam = (props, expr, lens) => {
  const exprLens = composeLens(lens, lenses.expr.lam.expr);
  const names = expr.names.map((name) => str(<Var>{name}</Var>));

  return seq([
    str('('),
    intersperse(names, str(', ')),
    str(')'),
    str(' -> '),
    printExpr(props, expr.expr, exprLens)
  ]);
};
const printExprApp = (props, expr, lens) => {
  const funcLens = composeLens(lens, lenses.expr.app.func);
  const args = expr.args.map((arg, i) => {
    const argLens = composeLens(lens, lenses.expr.app.arg(i));
    return printExpr(props, arg, argLens);
  });

  return seq([
    printExpr(props, expr.func, funcLens),
    str('('),
    intersperse(args, str(', ')),
    str(')')
  ]);
};

// Binding
const printBind = (props, bind, lens) => match(bind, {
  'Bind.Let': () => printBindLet(props, bind, lens)
});
const printBindLet = (props, bind, lens) => {
  const exprLens = composeLens(lens, lenses.bind.let.expr);
  return seq([
    str('let '),
    str(<Var>{bind.name}</Var>),
    str(' = '),
    printExpr(props, bind.expr, exprLens)
  ]);
};

export {
  printCmd,
  printBlock,
  printExpr,
  printBind
};
