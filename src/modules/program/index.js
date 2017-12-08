import React from 'react';
import PropTypes from 'prop-types';
import { propertyLens, indexLens } from 'utils/lenses';
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
  onChange: PropTypes.func
};

const MoveCommand = ({command, onChange}) => {
  const onNumberChange = (value) => onChange(command.set(distanceLens, value))
  return (
    <span>
      move&nbsp;
      <Number value={command.data.distance} onChange={onNumberChange}/>
    </span>
  );
};
const TurnCommand = ({command, onChange}) => {
  const onNumberChange = (value) => onChange(command.set(degreesLens, value));
  return (
    <span>
      turn&nbsp;
      <Number value={command.data.degrees} onChange={onNumberChange}/>
    </span>
  );
};


const Program = (props) => {
  const {
    commands,
    onCommandChange
  } = props;

  const children = commands.map((command, i) => {
    const lens = indexLens(i);
    const onChange = (newValue) => { onCommandChange(lens, newValue); };

    return (
      <div key={i} className={cx('program_line')}>
        <Command command={command} onChange={onChange}/>
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
  commands: PropTypes.array.isRequired,
  onCommandChange: PropTypes.func.isRequired
};

export default Program;
