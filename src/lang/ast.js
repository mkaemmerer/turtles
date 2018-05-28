const Cmd = (type, data) => ({type, ...data});
Cmd.Move  = ({expr}) => Cmd('Cmd.Move', {expr});
Cmd.Turn  = ({expr}) => Cmd('Cmd.Turn', {expr});
Cmd.Block = ({binds, cmds}) => Cmd('Cmd.Block', {binds, cmds});

const Expr = (type, data) => ({type, ...data});
Expr.Cmd   = ({cmd})   => Expr('Expr.Cmd',   {cmd});
Expr.Const = ({value}) => Expr('Expr.Const', {value});
Expr.Var   = ({name})  => Expr('Expr.Var',   {name});
Expr.App   = ({func, args}) => Expr('Expr.App', {func, args});
Expr.Lam   = ({names, expr}) => Expr('Expr.Lam', {names, expr});

const Bind = (type, data) => ({type, ...data});
Bind.Let = ({name, expr}) => Bind('Bind.Let', {name, expr});

export {
  Cmd,
  Expr,
  Bind
};
