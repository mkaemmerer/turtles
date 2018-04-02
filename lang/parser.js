const P = require('parsimmon');

const newline     = P.alt(P.string('\r\n'), P.oneOf('\r\n')).desc('newline');
const space       = P.string(' ');
const spaces      = P.regex(/[ ]+/);
const optSpaces   = P.regex(/[ ]*/);
const countSpaces = P.regexp(/[ ]*/).map(s => s.length);
const indentBy    = (n) => countSpaces
  .chain(x => {
    return (x === n)
      ? P.of(n)
      : P.fail(`exactly ${n} spaces`)
  });
const indentLine = (indent) => (parser) => indentBy(indent).then(parser);

//Tokens
const tMove  = P.string('move');
const tTurn  = P.string('turn');
const tLet   = P.string('let');
const tEqual = P.string('=');
const tComma = P.string(',');
const tVar   = P.regex(/[a-zA-Z_-]+/).desc('a variable');
const tNum   = P.regex(/-?[0-9]+/).map(x => Number(x)).desc('a number');
const tOpenParen  = P.string('(');
const tCloseParen = P.string(')');


//Primitives
const prim  = P.lazy(() => P.alt(pMove, pTurn));
const pMove = tMove.result({ 'type': 'Prim.Move' });
const pTurn = tTurn.result({ 'type': 'Prim.Turn' });

//Expressions
const expr = P.lazy(() => P.alt(eCmd, eConst, eVar).chain(exprMore));
const exprMore = (expr) =>
  P.alt(
    P.of(expr).notFollowedBy(tOpenParen),
    eApp(expr).chain(exprMore)
  );

const eCmd   = cmd.map((cmd)    => ({ type: 'Expr.Cmd',   cmd }));
const eConst = tNum.map((value) => ({ type: 'Expr.Const', value }));
const eVar   = tVar.map((name)  => ({ type: 'Expr.Var',   name }));
const eApp   = (expr1) => P.seqObj(
  ['type',  P.of('Expr.App')],
  ['func',  P.of(expr1)],
  ['args',  expr.sepBy(tComma.then(space)).wrap(tOpenParen, tCloseParen)]
);

//Bindings
const binding = P.lazy(() => P.alt(bLet));
const bLet = P.seqObj(
  ['type',  P.of('Binding.Let')],
  tLet.then(space),
  ['name',  tVar],
  space.then(tEqual).then(space),
  ['expr',  expr]
);

//Block scope
const cmd = P.lazy(() => P.alt(cMove, cTurn, cBlock(0)));
const cMove = tMove.then(expr).wrap(tOpenParen, tCloseParen)
  .map((expr) => ({type: 'Cmd.Move', expr }));
const cTurn = tTurn.then(expr).wrap(tOpenParen, tCloseParen)
  .map((expr) => ({type: 'Cmd.Turn', expr }));
const cBlock = (indent) => {
  const bindingsPart = binding.sepBy(newline);
  const commandsPart = expr.sepBy(newline);

  return P
    .seqObj(
      ['type', P.of('Cmd.Block')],
      ['bindings', bindingsPart],
      newline,
      ['commands', commandsPart]
    );
};


const program = cBlock(0).skip(newline).skip(P.eof);
module.exports = program;