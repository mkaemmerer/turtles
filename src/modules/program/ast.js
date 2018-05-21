import React from 'react';
import PropTypes from 'prop-types';
import { idLens, safeLens, indexLens, propertyLens, composeLens } from 'utils/lenses';
import Number from 'components/number';
import ProgramLine from './line';

import styles from './ast.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const match = (node, handlers) => handlers[node.type](node);
const intersperse = (arr, sep) => {
  if (arr.length === 0) {
    return [];
  }
  return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
};

const mouseHandlerTypes = {
  onDistanceDragStart: PropTypes.func.isRequired,
  onDistanceDragEnd:   PropTypes.func.isRequired,
  onDegreesDragStart:  PropTypes.func.isRequired,
  onDegreesDragEnd:    PropTypes.func.isRequired
};

// Block
const Block = ({block, onChange, onMouseEnter, highlightedCommands, ...props}) => {
  const binds = block.binds.map((bindExpr, i) => {
    const lens = composeLens(
      safeLens(propertyLens('binds'), []),
      safeLens(indexLens(i), {})
    );
    const onBindingChange = (cmd) => {
      onChange(lens.set(block, cmd));
    };
    const onBindingMouseEnter = (child) => {
      onMouseEnter(composeLens(lens, child));
    };
    return (
      <Bind
        {...props}
        key={i}
        bind={bindExpr}
        onChange={onBindingChange}
        onMouseEnter={onBindingMouseEnter}
        highlightedCommands={lens.get(highlightedCommands)}
      />
    );
  });
  const cmds = block.cmds.map((cmdExpr, i) => {
    const lens = composeLens(
      safeLens(propertyLens('cmds'), []),
      safeLens(indexLens(i), {})
    );
    const onExpressionChange = (cmd) => {
      onChange(lens.set(block, cmd));
    };
    const onExpressionMouseEnter = (child) => {
      onMouseEnter(composeLens(lens, child));
    };
    return (
      <Expression
        {...props}
        key={i}
        expr={cmdExpr}
        onChange={onExpressionChange}
        onMouseEnter={onExpressionMouseEnter}
        highlightedCommands={lens.get(highlightedCommands)}
      />
    );
  });

  return (<div>{binds}{cmds}</div>);
};
Block.propTypes = {
  block: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  ...mouseHandlerTypes
};

// Bindings
const Bind = (props) =>
  match(props.bind, {
    'Bind.Let'() { return (<LetBind {...props}/>); }
  });
Bind.propTypes = {
  bind: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  highlightedCommands: PropTypes.object,
  ...mouseHandlerTypes
};

const LetBind = ({bind, onChange, highlightedCommands, ...props}) => {
  const lens = safeLens(propertyLens('expr'), {});
  const onExprChange = (expr) => {
    onChange(lens.set(bind, expr));
  };
  return (
    <ProgramLine>
      let&nbsp;
      <span className={cx('variable')}>{bind.name}</span>
      &nbsp;=&nbsp;
      <Expression
        {...props}
        expr={bind.expr}
        onChange={onExprChange}
        highlightedCommands={lens.get(highlightedCommands)}
      />
    </ProgramLine>
  );
};

// Commands
const Command = (props) =>
  match(props.cmd, {
    'Cmd.Move'()  { return (<MoveCommand {...props}/>); },
    'Cmd.Turn'()  { return (<TurnCommand {...props}/>); },
    'Cmd.Block'() { return (<Block block={props.cmd} {...props}/>); }
  });
Command.propTypes = {
  cmd: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  ...mouseHandlerTypes
};

const MoveCommand = ({cmd, onChange, onMouseEnter, onMouseLeave, highlightedCommands, ...props }) => {
  const lens = propertyLens('expr');
  const onExprChange = (expr) => {
    onChange(lens.set(cmd, expr));
  };
  const onLineMouseEnter = () => {
    onMouseEnter(idLens);
  };
  return (
    <ProgramLine
      onMouseEnter={onLineMouseEnter}
      onMouseLeave={onMouseLeave}
      isHighlighted={highlightedCommands === true}
    >
      move&nbsp;
      <Expression
        {...props}
        expr={cmd.expr}
        kind="distance"
        onChange={onExprChange}
      />
    </ProgramLine>
  );
};
const TurnCommand = ({cmd, onChange, onMouseEnter, onMouseLeave, highlightedCommands, ...props }) => {
  const lens = propertyLens('expr');
  const onExprChange = (expr) => {
    onChange(lens.set(cmd, expr));
  };
  const onLineMouseEnter = () => {
    onMouseEnter(idLens);
  };
  return (
    <ProgramLine
      onMouseEnter={onLineMouseEnter}
      onMouseLeave={onMouseLeave}
      isHighlighted={highlightedCommands === true}
    >
      turn&nbsp;
      <Expression
        {...props}
        expr={cmd.expr}
        kind="degrees"
        onChange={onExprChange}
      />
    </ProgramLine>
  );
};

// Expressions
const Expression = (props) =>
  match(props.expr, {
    'Expr.Cmd'()   { return (<CommandExpression {...props}/>); },
    'Expr.Const'() { return (<ConstExpression {...props}/>); },
    'Expr.Var'()   { return (<VarExpression {...props}/>); },
    'Expr.Lam'()   { return (<LamExpression {...props}/>); },
    'Expr.App'()   { return (<AppExpression {...props}/>); }
  });
Expression.propTypes = {
  expr: PropTypes.object.isRequired,
  kind: PropTypes.oneOf(['distance', 'degrees']),
  onChange: PropTypes.func,
  highlightedCommands: PropTypes.object,
  ...mouseHandlerTypes
};

const CommandExpression = ({ expr, onChange, onMouseEnter, highlightedCommands, ...props }) => {
  const lens = safeLens(propertyLens('cmd'), {});
  const onCmdChange = (cmd) => {
    onChange(lens.set(expr, cmd));
  };
  const onCmdMouseEnter = (child) => {
    onMouseEnter(composeLens(lens, child));
  };

  return (
    <Command
      {...props}
      cmd={expr.cmd}
      onChange={ onCmdChange }
      onMouseEnter={ onCmdMouseEnter }
      highlightedCommands={lens.get(highlightedCommands)}
    />
  );
};
const ConstExpression = ({ expr, kind, onChange, ...props }) => {
  const lens = propertyLens('value');
  const onValueChange = (value) => {
    onChange(lens.set(expr, value));
  };

  const onDragStart = kind === 'degrees'
    ? props.onDegreesDragStart
    : props.onDistanceDragStart;
  const onDragEnd = kind === 'degrees'
    ? props.onDegreesDragEnd
    : props.onDistanceDragEnd;

  const increment = kind === 'degrees' ? 15 : 10;

  return (
    <span className={cx('constant')}>
      <Number
        value={expr.value}
        increment={increment}
        scaleFactor={0.1}
        onChange={onValueChange}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </span>
  );
};
const VarExpression = ({ expr }) => (
  <span className={cx('variable')}>{expr.name}</span>
);
const LamExpression = ({ expr, onChange, highlightedCommands, ...props }) => {
  const names = expr.names.map((name) => (
    <span key={name} className={cx('variable')}>{name}</span>
  ));

  const lens = safeLens(propertyLens('expr'), {});
  const onBodyChange = (body) => {
    onChange(lens.set(expr, body));
  };
  const body = (
    <Expression
      expr={expr.expr}
      onChange={onBodyChange}
      highlightedCommands={lens.get(highlightedCommands)}
      {...props}
    />
  );

  return (
    <React.Fragment>
      ({intersperse(names, ', ')}) -&gt;
      {body}
    </React.Fragment>
  );
};
const AppExpression = ({expr, onChange, highlightedCommands, ...props}) => {
  const lens = safeLens(propertyLens('func'), {});
  const onFuncChange = (func) => {
    onChange(lens.set(expr, func));
  };
  return (
    <Expression
      expr={expr.func}
      onChange={onFuncChange}
      {...props}
      highlightedCommands={lens.get(highlightedCommands)}
    />
  );
};


export {
  Block,
  Command,
  Expression
}
