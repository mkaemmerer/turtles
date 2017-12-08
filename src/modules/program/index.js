import React from 'react';
import PropTypes from 'prop-types';
import { propertyLens, safeLens } from 'utils/lenses';
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


const Program = ({program, onProgramChange, onHoverChange, highlightedCommands}) => {
  const children = program.lines.map((line, i) => {
    const { command, lens } = line;
    const onCommandChange = (newCommand) => {
      onProgramChange(program.set(lens, newCommand));
    };
    const isHighlighted = safeLens(lens, false).get(highlightedCommands);
    const className     = cx('program_line', { 'program_line--highlighted': isHighlighted });
    const onMouseEnter  = () => { onHoverChange(line); };
    const onMouseLeave  = () => { onHoverChange(null);  };

    return (
      <div key={i} className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
  onProgramChange: PropTypes.func.isRequired,
  onHoverChange: PropTypes.func.isRequired,
  highlightedCommands: PropTypes.array.isRequired
};

export default Program;
