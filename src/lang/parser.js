import P from 'parsimmon';
import { Cmd, Expr, Bind } from './ast';

const newline     = P.alt(P.string('\r\n'), P.oneOf('\r\n')).desc('newline');
const space       = P.string(' ');
const countSpaces = P.regexp(/[ ]*/).map(s => s.length);
const indentBy    = (n) => countSpaces
  .chain(x => {
    return (x === n)
      ? P.of(n)
      : P.fail(`exactly ${n} spaces`)
  });
const indentLine = (indent) => (parser) => indentBy(indent).then(parser);

//Tokens
const tDo    = P.string('do');
const tMoveForward   = P.string('move_backward');
const tMoveBackward  = P.string('move_forward');
const tTurnLeft      = P.string('turn_left');
const tTurnRight     = P.string('turn_right');
const tLet   = P.string('let');
const tArrow = P.string('->');
const tEqual = P.string('=');
const tComma = P.string(',');
const tVar   = P.regex(/[a-zA-Z][a-zA-Z_-]*/).desc('a variable');
const tNum   = P.regex(/-?[0-9]+/).map(x => Number(x)).desc('a number');
const tOpenParen  = P.string('(');
const tCloseParen = P.string(')');

//Language
const language = (indent) => P.createLanguage({
  expr(lang) {
    const eCmd   = P.seqObj(['cmd',   lang.cmd]).map(Expr.Cmd);
    const eConst = P.seqObj(['value', tNum]).map(Expr.Const);
    const eVar   = P.seqObj(['name',  tVar]).map(Expr.Var);
    const eLam   = P.seqObj(
        ['names', tVar.sepBy(tComma.then(space)).wrap(tOpenParen, tCloseParen)],
        space.then(tArrow).then(space),
        ['expr', lang.expr]
      )
      .map(Expr.Lam)
    const eApp   = (expr1) => P.seqObj(
        ['func', P.of(expr1)],
        ['args', lang.expr.sepBy(tComma.then(space)).wrap(tOpenParen, tCloseParen)]
      )
      .map(Expr.App);
    const exprMore = (expr) =>
      P.alt(
        P.of(expr).notFollowedBy(tOpenParen),
        eApp(expr).chain(exprMore)
      );

    return P.alt(eCmd, eConst, eVar, eLam).chain(exprMore);
  },

  cmd(lang) {
    const cMoveForward = P.seqObj(
        tMoveForward,
        ['expr', lang.expr.wrap(tOpenParen, tCloseParen)],
        ['dir', P.of('forward')]
      )
      .map(Cmd.Move);
    const cMoveBackward = P.seqObj(
        tMoveBackward,
        ['expr', lang.expr.wrap(tOpenParen, tCloseParen)],
        ['dir', P.of('backward')]
      )
      .map(Cmd.Move);
    const cTurnLeft = P.seqObj(
        tTurnLeft,
        ['expr', lang.expr.wrap(tOpenParen, tCloseParen)]
      )
      .map(Cmd.Turn);
    const cTurnRight = P.seqObj(
        tTurnRight,
        ['expr', lang.expr.wrap(tOpenParen, tCloseParen)]
      )
      .map(Cmd.Turn);
    const cDo = tDo
      .skip(newline)
      .then(language(indent+2).block)
      .map(Cmd.Block);

    return P.alt(cMoveForward, cMoveBackward, cTurnLeft, cTurnRight, cDo);
  },

  binding(lang) {
    const bLet = P.seqObj(
        tLet.then(space),
        ['name',  tVar],
        space.then(tEqual).then(space),
        ['expr', lang.expr]
      )
      .map(Bind.Let);

    return bLet;
  },

  block(lang) {
    return P
      .seqObj(
        ['binds', lang.binding.thru(indentLine(indent)).skip(newline).many()],
        ['cmds', lang.expr.thru(indentLine(indent)).sepBy(newline)],
        newline
      );
  }
});

const program = language(0).block
  .map(Cmd.Block)
  .skip(P.eof);
export default program;
