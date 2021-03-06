import { indent, concat, str, seq, intersperse, newline, Doc } from './doc';
import match from './match';

const layout = (doc) => match(doc, {
  'Doc.Empty': () => '',
  'Doc.Text': ({text,  doc}) => `${text}${layout(doc)}`,
  'Doc.Line': ({depth, doc}) => `\n${' '.repeat(depth)}${layout(doc)}`
});

// Command
const printCommand = (command) =>
  match(command, {
    'Cmd.Move':  ({expr, dir}) => seq([
      printMoveDirection(dir),
      str('('),
      printExpr(expr),
      str(')')
    ]),
    'Cmd.Turn':  ({expr, dir}) => seq([
      printTurnDirection(dir),
      str('('),
      printExpr(expr),
      str(')')
    ]),
    'Cmd.Block': (block) => seq([
      str('do'),
      indent(concat(newline, printBlock(block)))
    ])
  });

const printBlock = ({binds, cmds}) => {
  const bindPart = (binds.length > 0)
    ? concat(intersperse(binds.map(printBind), newline), newline)
    : Doc.Empty;
  const cmdPart = intersperse(cmds.map(printExpr), newline);
  return seq([bindPart, cmdPart, newline]);
};

const printMoveDirection = (dir) => {
  switch(dir) {
    case 'forward':  return str('move_forward');
    case 'backward': return str('move_backward');
  }
};
const printTurnDirection = (dir) => {
  switch(dir) {
    case 'left':  return str('turn_left');
    case 'right': return str('turn_right');
  }
};

// Expression
const printExpr = (expr) =>
  match(expr, {
    'Expr.Var':   ({name})  => str(name),
    'Expr.Const': ({value}) => str(`${value}`),
    'Expr.Cmd':   ({cmd})   => printCommand(cmd),
    'Expr.Lam':   ({names, expr}) => seq([
      intersperse(names.map(str), str(', ')),
      str(' -> '),
      printExpr(expr)
    ]),
    'Expr.App':   ({func, args}) => seq([
      printExpr(func),
      str('('),
      intersperse(args.map(printExpr), str(', ')),
      str(')')
    ])
  });

// Binding
const printBind = (bind) => match(bind, {
  'Bind.Let': ({name, expr}) => seq([
    str('let '),
    str(name),
    str(' = '),
    printExpr(expr)
  ])
});


const printProgram = (program) => layout(printBlock(program));
export default printProgram;
