import React from 'react';
import { composeLens, idLens } from 'utils/lenses';
import Number from 'components/number';
import Lens from 'lang/ast-lenses';
import { indent, concat, str, seq, intersperse, newline, Doc } from 'lang/doc';

import styles from './ast.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const match = (node, handlers) => handlers[node.type](node);

// Sentry
const Sentry = () => null;

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
    const bindLens = composeLens(lens, Lens.Cmd.Block.bind(i));
    return printBind(props, bind, bindLens);
  });
  const cmds  = block.cmds.map((cmd, i) => {
    const cmdLens = composeLens(lens, Lens.Cmd.Block.cmd(i));
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
  const exprLens = composeLens(lens, Lens.Cmd.Move.expr);
  return seq([
    str(<Sentry lens={lens}/>),
    str('move'),
    str('('),
    printExpr({kind: 'distance', ...props}, cmd.expr, exprLens),
    str(')')
  ]);
};
const printCmdTurn = (props, cmd, lens) => {
  const exprLens = composeLens(lens, Lens.Cmd.Turn.expr);
  return seq([
    str(<Sentry lens={lens}/>),
    str('turn'),
    str('('),
    printExpr({kind: 'degrees', ...props}, cmd.expr, exprLens),
    str(')')
  ]);
};
const printCmdBlock = (props, cmd, lens) => {
  return seq([
    str(<Sentry lens={lens}/>),
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
  const constLens = composeLens(lens, Lens.Expr.Const.value);
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
  const cmdLens = composeLens(lens, Lens.Expr.Cmd.cmd);
  return printCmd(props, expr.cmd, cmdLens);
};
const printExprLam = (props, expr, lens) => {
  const exprLens = composeLens(lens, Lens.Expr.Lam.expr);
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
  const funcLens = composeLens(lens, Lens.Expr.App.func);
  const args = expr.args.map((arg, i) => {
    const argLens = composeLens(lens, Lens.Expr.App.arg(i));
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
  const exprLens = composeLens(lens, Lens.Bind.Let.expr);
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
  printBind,
  Sentry
};
