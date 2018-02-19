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

//Expressions
const expr   = P.lazy(() => P.alt(eApp, expr1));
const expr1  = P.lazy(() => P.alt(ePrim, eConst, eVar));
const ePrim  = P.alt(tMove, tTurn).map((name) => ({ type: 'ePrim', name }));
const eConst = tNum.map((value) => ({ type: 'eConst', value }));
const eVar   = tVar.map((name)  => ({ type: 'eVar',   name }));
const eApp   = P.seqObj(
  ['type',  P.of('eApp')],
  ['func',  expr1],
  ['args',  expr.sepBy(tComma.then(space)).wrap(tOpenParen, tCloseParen)]
);

//Bindings
const binding = P.lazy(() => P.alt(bLet));
const bLet = P.seqObj(
  ['type',  P.of('bLet')],
  tLet.then(space),
  ['var',   tVar],
  space.then(tEqual).then(space),
  ['value', expr]
);

//Block scope
const block = (indent) => {
  const bindingsPart = binding.sepBy(newline);
  const commandsPart = expr.sepBy(newline);

  return P
    .seqObj(
      ['type', P.of('block')],
      ['bindings', bindingsPart],
      newline,
      ['commands', commandsPart]
    );
};


const program = block(0).skip(newline).skip(P.eof);
module.exports = program;
