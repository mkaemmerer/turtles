import React from 'react';
import PropTypes from 'prop-types';
import { safeLens } from 'utils/lenses';
import ProgramLine from './line';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Program = ({program, onProgramChange, onHoverChange, highlightedCommands}) => {
  const children = program.lines().map((line, i) => {
    const { command, lens } = line;
    const isHighlighted = safeLens(lens, false).get(highlightedCommands);
    const onCommandChange = (command) => {
      onProgramChange(program.set(lens, command));
    };
    const onMouseEnter  = () => { onHoverChange(line); };
    const onMouseLeave  = () => { onHoverChange(null); };

    return (
      <ProgramLine
        key={i}
        command={command}
        isHighlighted={isHighlighted}
        onCommandChange={onCommandChange}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
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
