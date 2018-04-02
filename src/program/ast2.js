const Cmd = (type, data) => ({type, ...data});
Cmd.Move  = ({expr}) => Cmd('Cmd.Move', {expr});
Cmd.Turn  = ({expr}) => Cmd('Cmd.Turn', {expr});
Cmd.Block = ({bindings, commands}) => Cmd('Cmd.Block', {bindings, commands});

const Expr = (type, data) => ({type, ...data});
Expr.Cmd   = ({cmd})   => Expr('Expr.Cmd',   {cmd});
Expr.Const = ({value}) => Expr('Expr.Const', {value});
Expr.Var   = ({name})  => Expr('Expr.Var',   {name});
Expr.App   = ({func, args}) => Expr('Expr.App', {func, args});

const Binding = (type, data) => ({type, ...data});
Binding.Let = ({name, expr}) => Binding('Binding.Let', {name, expr});

export {
  Cmd,
  Expr,
  Binding
};
