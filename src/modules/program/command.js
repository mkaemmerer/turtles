import React from 'react';
import PropTypes from 'prop-types';
import { propertyLens } from 'utils/lenses';
import Number from 'components/number';

const distanceLens = propertyLens('distance');
const degreesLens  = propertyLens('degrees');

const Command = (props) =>
  props.command.match({
    move(){ return (<MoveCommand {...props}/>); },
    turn(){ return (<TurnCommand {...props}/>); }
  });
Command.propTypes = {
  command: PropTypes.object.isRequired,
  onCommandChange: PropTypes.func
};

const MoveCommand = ({command, onCommandChange}) => {
  const onNumberChange = (value) => onCommandChange(command.set(distanceLens, value));
  return (
    <span>
      move &nbsp;
      <Number value={command.data.distance} increment={10} scaleFactor={0.1} onChange={onNumberChange}/>
    </span>
  );
};
const TurnCommand = ({command, onCommandChange}) => {
  const onNumberChange = (value) => onCommandChange(command.set(degreesLens, value));
  return (
    <span>
      turn &nbsp;
      <Number value={command.data.degrees} increment={15} scaleFactor={0.5} onChange={onNumberChange}/>
    </span>
  );
};

export default Command;
