import React from 'react';
import PropTypes from 'prop-types';
import { idLens, safeLens, indexLens, propertyLens, composeLens } from 'utils/lenses';
import Number from 'components/number';
import ProgramLine from './line';

import styles from './ast.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const match = (node, handlers) => handlers[node.type](node);

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
    return (
      <Bind
        {...props}
        key={i}
        bind={bindExpr}
        onChange={onBindingChange}
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

const LetBind = ({bind, onChange, ...props}) => {
  const lens = propertyLens('expr');
  const onExprChange = (expr) => {
    onChange(lens.set(bind, expr));
  };
  return (
    <ProgramLine>
      let &nbsp;
      <span className={cx('variable')}>{bind.name}</span>
      &nbsp;=&nbsp;
      <Expression
        {...props}
        expr={bind.expr}
        onChange={onExprChange}
      />
    </ProgramLine>
  );
};

// Commands
const Command = (props) =>
  match(props.cmd, {
    'Cmd.Move'()  { return (<MoveCommand {...props}/>); },
    'Cmd.Turn'()  { return (<TurnCommand {...props}/>); },
    'Cmd.Block'() { return (<Block block={props.command} {...props}/>); }
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
      move &nbsp;
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
      turn &nbsp;
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
    'Expr.Const'() { return (<ConstExpression {...props}/>); },
    'Expr.Cmd'()   { return (<CommandExpression {...props}/>); },
    'Expr.Var'()   { return (<VarExpression {...props}/>); }
  });
Expression.propTypes = {
  expr: PropTypes.object.isRequired,
  kind: PropTypes.oneOf(['distance', 'degrees']),
  onChange: PropTypes.func,
  highlightedCommands: PropTypes.object,
  ...mouseHandlerTypes
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
const VarExpression = ({ expr }) => {
  return (
    <span className={cx('variable')}>{expr.name}</span>
  );
};


export {
  Block,
  Command,
  Expression
}
