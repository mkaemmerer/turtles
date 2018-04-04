import React from 'react';
import PropTypes from 'prop-types';
import { safeLens, indexLens, propertyLens, composeLens } from 'utils/lenses';
import Number from 'components/number';
import ProgramLine from './line';

const match = (node, handlers) => handlers[node.type](node);

const mouseHandlerTypes = {
  // onMouseEnter: PropTypes.func.isRequired,
  // onMouseLeave: PropTypes.func.isRequired,
  onDistanceDragStart: PropTypes.func.isRequired,
  onDistanceDragEnd:   PropTypes.func.isRequired,
  onDegreesDragStart:  PropTypes.func.isRequired,
  onDegreesDragEnd:    PropTypes.func.isRequired
};

// Block
const Block = ({block, onChange, ...props}) => {
  const renderCommandExpression = (cmdExpr, lens, i) => {
    const onExpressionChange = (cmd) => {
      onChange(lens.set(block, cmd));
    };
    return (
      <Expression
        {...props}
        key={i}
        expr={cmdExpr}
        onChange={onExpressionChange}
      />
    );
  }
  const cmds = block.cmds.map((cmdExpr, i) => {
    const lens = composeLens(
      safeLens(propertyLens('cmds'), []),
      indexLens(i)
    );
    return renderCommandExpression(cmdExpr, lens, i);
  });

  return (<div>{cmds}</div>);
};
Block.propTypes = {
  block: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  ...mouseHandlerTypes
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
  ...mouseHandlerTypes
};

const MoveCommand = ({cmd, onChange, ...props }) => {
  const onExprChange = (expr) => {
    const lens = propertyLens('expr');
    onChange(lens.set(cmd, expr));
  };
  return (
    <ProgramLine>
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
const TurnCommand = ({cmd, onChange, ...props }) => {
  const onExprChange = (expr) => {
    const lens = propertyLens('expr');
    onChange(lens.set(cmd, expr));
  };
  return (
    <ProgramLine>
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
    'Expr.Cmd'()   { return (<CommandExpression {...props}/>); }
  });
Expression.propTypes = {
  expr: PropTypes.object.isRequired,
  kind: PropTypes.oneOf(['distance', 'degrees']),
  onChange:    PropTypes.func,
  ...mouseHandlerTypes
};

const ConstExpression = ({ expr, kind, onChange, ...props }) => {
  const onValueChange = (value) => {
    const lens = propertyLens('value');
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
    <Number
      value={expr.value}
      increment={increment}
      scaleFactor={0.1}
      onChange={onValueChange}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  );
};
const CommandExpression = ({ expr, onChange, ...props }) => {
  const onCmdChange = (cmd) => {
    const lens = propertyLens('cmd');
    onChange(lens.set(expr, cmd));
  };

  return (
    <Command
      {...props}
      cmd={expr.cmd}
      onChange={ onCmdChange }
    />
  );
};


export {
  Block,
  Command,
  Expression
}
