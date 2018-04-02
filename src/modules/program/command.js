import React from 'react';
import PropTypes from 'prop-types';
import * as AST from 'lang/ast';
import Number from 'components/number';

const MoveConst = (value) => AST.Cmd.Move({ expr: AST.Expr.Const({ value }) });
const TurnConst = (value) => AST.Cmd.Turn({ expr: AST.Expr.Const({ value }) });

const match = (node, handlers) => handlers[node.type](node);

const Command = (props) =>
  match(props.command, {
    'Cmd.Move'({expr}) { return (<MoveCommand expr={expr} {...props}/>); },
    'Cmd.Turn'({expr}) { return (<TurnCommand expr={expr} {...props}/>); },
    'Cmd.Block': () => null
  });
Command.propTypes = {
  command: PropTypes.object.isRequired,
  onCommandChange: PropTypes.func,
  onDistanceDragStart: PropTypes.func,
  onDistanceDragEnd:   PropTypes.func,
  onDegreesDragStart:  PropTypes.func,
  onDegreesDragEnd:    PropTypes.func
};

const MoveCommand = ({expr, onCommandChange, onDistanceDragStart, onDistanceDragEnd }) => {
  const onNumberChange = (value) => {
    onCommandChange(MoveConst(value));
  };
  return (
    <span>
      move &nbsp;
      <Number
        value={expr.value}
        increment={10}
        scaleFactor={0.1}
        onChange={onNumberChange}
        onDragStart={onDistanceDragStart}
        onDragEnd={onDistanceDragEnd}
      />
    </span>
  );
};
const TurnCommand = ({expr, onCommandChange, onDegreesDragStart, onDegreesDragEnd }) => {
  const onNumberChange = (value) => {
    onCommandChange(TurnConst(value));
  };
  return (
    <span>
      turn &nbsp;
      <Number
        value={expr.value}
        increment={15}
        scaleFactor={0.5}
        onChange={onNumberChange}
        onDragStart={onDegreesDragStart}
        onDragEnd={onDegreesDragEnd}
      />
    </span>
  );
};

export default Command;
