import React from 'react';
// import PropTypes from 'prop-types';
// import { idLens, safeLens, indexLens, propertyLens, composeLens } from 'utils/lenses';

const match = (node, handlers) => handlers[node.type](node);

const PP = {
  Empty: { type: 'PP.Empty' },
  Text: ({text,  doc}) => ({ type: 'PP.Text', text,  doc}),
  Line: ({depth, doc}) => ({ type: 'PP.Line', depth, doc}),

  indent: (doc) => match(doc, {
    'PP.Empty': () => PP.Empty,
    'PP.Text': ({text, doc}) => PP.Text({
      text,
      doc: PP.indent(doc)
    }),
    'PP.Line': ({depth, doc}) => PP.Line({
      depth: depth+1,
      doc: PP.indent(doc)
    })
  }),
  concat: (doc1, doc2) => match(doc1, {
    'PP.Empty': () => doc2,
    'PP.Text': ({text, doc}) => PP.Text({
      text,
      doc: PP.concat(doc, doc2)
    }),
    'PP.Line': ({depth, doc}) => PP.Line({
      depth,
      doc: PP.concat(doc, doc2)
    })
  }),
  layout: (doc) => match(doc, {
    'PP.Empty': () => [],
    'PP.Text': ({text,  doc}) => {
      const [line = '', ...lines] = PP.layout(doc);
      return [`${text}${line}`, ...lines];
    },
    'PP.Line': ({depth, doc}) => {
      const [line = '', ...lines] = PP.layout(doc);
      return ['', `${' '.repeat(depth)}${line}`, ...lines];
    }
  })
};
PP.str         = (text) => PP.Text({text, doc: PP.Empty});
PP.seq         = (arr) => arr.reduce(PP.concat, PP.Empty);
PP.newline     = PP.Line({depth: 0, doc: PP.Empty});
PP.intersperse = (docs, sep) =>
  docs.reduce((acc, doc) =>
    (doc === docs[0])
      ? doc
      : PP.seq([acc, sep, doc])
  , PP.Empty);

// Command
const printCommand = (command) =>
  match(command, {
    'Cmd.Move':  ({expr}) => PP.seq([
      PP.str('move('),
      printExpr(expr),
      PP.str(')')
    ]),
    'Cmd.Turn':  ({expr}) => PP.seq([
      PP.str('turn('),
      printExpr(expr),
      PP.str(')')
    ]),
    'Cmd.Block': (block) => PP.seq([
      PP.str('do'),
      PP.indent(PP.concat(PP.newline, printBlock(block)))
    ])
  });

const printBlock = ({binds, cmds}) => {
  const bindPart = (binds.length > 0)
    ? PP.concat(PP.intersperse(binds.map(printBind), PP.newline), PP.newline)
    : PP.Empty;
  const cmdPart = PP.intersperse(cmds.map(printExpr), PP.newline);
  return PP.seq([bindPart, cmdPart, PP.newline]);
};

// Expression
const printExpr = (expr) =>
  match(expr, {
    'Expr.Var':   ({name})  => PP.str(name),
    'Expr.Const': ({value}) => PP.str(`${value}`),
    'Expr.Cmd':   ({cmd})   => printCommand(cmd),
    'Expr.Lam':   ({names, expr}) => PP.seq([
      PP.intersperse(names.map(PP.str), PP.str(', ')),
      PP.str(' -> '),
      printExpr(expr)
    ]),
    'Expr.App':   ({func, args}) => PP.seq([
      printExpr(func),
      PP.str('('),
      PP.intersperse(args.map(printExpr), PP.str(', ')),
      PP.str(')')
    ])
  });

// Binding
const printBind = (bind) => match(bind, {
  'Bind.Let': ({name, expr}) => PP.seq([
    PP.str('let '),
    PP.str(name),
    PP.str(' = '),
    printExpr(expr)
  ])
});

const Lines = ({program}) => {
  const lines = PP.layout(printBlock(program));
  const lineElements = lines.map((line, i) => (
    <div key={i}>{line}</div>
  ));

  return (
    <React.Fragment>
      {lineElements}
    </React.Fragment>
  )
}
export default Lines;
