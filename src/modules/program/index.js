import React from 'react';
import PropTypes from 'prop-types';
import { propertyLens } from 'utils/lenses';
import Number from 'components/number';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

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
  const onNumberChange = (value) => onCommandChange(command.set(distanceLens, value))
  return (
    <span>
      move&nbsp;
      <Number value={command.data.distance} onChange={onNumberChange}/>
    </span>
  );
};
const TurnCommand = ({command, onCommandChange}) => {
  const onNumberChange = (value) => onCommandChange(command.set(degreesLens, value));
  return (
    <span>
      turn&nbsp;
      <Number value={command.data.degrees} onChange={onNumberChange}/>
    </span>
  );
};


const Program = ({ program, onProgramChange }) => {
  const children = program.lines.map(({command, lens}, i) => {
    const onCommandChange = (newCommand) => {
      onProgramChange(program.set(lens, newCommand));
    };

    return (
      <div key={i} className={cx('program_line')}>
        <Command command={command} onCommandChange={onCommandChange}/>
      </div>
    );
  });

  return (
    <div className={cx('program')}>
      {children}
    </div>
  );
};
Program.propTypes = {
  program: PropTypes.object.isRequired,
  onProgramChange: PropTypes.func.isRequired
};

export default Program;
