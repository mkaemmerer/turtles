import React from 'react';
import PropTypes from 'prop-types';
import { CommandPrim } from 'program/command';
import Number from 'components/number';

const Command = (props) =>
  CommandPrim.match(props.command, {
    Move(distance){ return (<MoveCommand distance={distance} {...props}/>); },
    Turn(degrees) { return (<TurnCommand degrees={degrees}   {...props}/>); }
  });
Command.propTypes = {
  command: PropTypes.object.isRequired,
  onCommandChange: PropTypes.func
};

const MoveCommand = ({command, distance, onCommandChange}) => {
  const onNumberChange = (value) => {
    onCommandChange(CommandPrim.lens.set(command, value));
  };
  return (
    <span>
      move &nbsp;
      <Number value={distance} increment={10} scaleFactor={0.1} onChange={onNumberChange}/>
    </span>
  );
};
const TurnCommand = ({command, degrees, onCommandChange}) => {
  const onNumberChange = (value) => {
    onCommandChange(CommandPrim.lens.set(command, value));
  };
  return (
    <span>
      turn &nbsp;
      <Number value={degrees} increment={15} scaleFactor={0.5} onChange={onNumberChange}/>
    </span>
  );
};

export default Command;
