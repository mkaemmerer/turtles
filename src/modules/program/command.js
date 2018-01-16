import React from 'react';
import PropTypes from 'prop-types';
import { CommandPrim } from 'program/ast';
import Number from 'components/number';

const Command = (props) =>
  CommandPrim.match(props.command, {
    Move(distance){ return (<MoveCommand distance={distance} {...props}/>); },
    Turn(degrees) { return (<TurnCommand degrees={degrees}   {...props}/>); }
  });
Command.propTypes = {
  command: PropTypes.object.isRequired,
  onCommandChange: PropTypes.func,
  onDistanceDragStart: PropTypes.func,
  onDistanceDragEnd:   PropTypes.func,
  onDegreesDragStart:  PropTypes.func,
  onDegreesDragEnd:    PropTypes.func
};

const MoveCommand = ({distance, onCommandChange, onDistanceDragStart, onDistanceDragEnd }) => {
  const onNumberChange = (value) => {
    onCommandChange(CommandPrim.Move(value));
  };
  return (
    <span>
      move &nbsp;
      <Number
        value={distance}
        increment={10}
        scaleFactor={0.1}
        onChange={onNumberChange}
        onDragStart={onDistanceDragStart}
        onDragEnd={onDistanceDragEnd}
      />
    </span>
  );
};
const TurnCommand = ({degrees, onCommandChange, onDegreesDragStart, onDegreesDragEnd }) => {
  const onNumberChange = (value) => {
    onCommandChange(CommandPrim.Turn(value));
  };
  return (
    <span>
      turn &nbsp;
      <Number
        value={degrees}
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
