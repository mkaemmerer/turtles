import React from 'react';
import PropTypes from 'prop-types';
import Command from './command';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const ProgramLine = ({ command, onCommandChange, onMouseEnter, onMouseLeave, onDragStart, onDragEnd, isHighlighted }) => {
  const className = cx('program_line', { 'program_line--highlighted': isHighlighted });

  return (
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Command command={command} onCommandChange={onCommandChange} onDragStart={onDragStart} onDragEnd={onDragEnd}/>
    </div>
  );
};
ProgramLine.propTypes = {
  command:         PropTypes.object.isRequired,
  onCommandChange: PropTypes.func.isRequired,
  onMouseEnter:  PropTypes.func,
  onMouseLeave:  PropTypes.func,
  onDragStart:   PropTypes.func,
  onDragEnd:     PropTypes.func,
  isHighlighted: PropTypes.bool.isRequired
};


class OptimizedProgramLine extends React.Component {
  onCommandChange = (command) => {
    this.props.onCommandChange(command);
  }
  onMouseEnter = () => {
    this.props.onMouseEnter();
  }
  onMouseLeave = () => {
    this.props.onMouseLeave();
  }

  shouldComponentUpdate(newProps) {
    const commandChanged   = newProps.command !== this.props.command;
    const highlightChanged = newProps.isHighlighted !== this.props.isHighlighted;
    return commandChanged || highlightChanged;
  }

  render() {
    const { command, isHighlighted, onDragStart, onDragEnd } = this.props;
    return (
      <ProgramLine
        command={command}
        isHighlighted={isHighlighted}
        onCommandChange={this.onCommandChange}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );
  }
}

export default OptimizedProgramLine;
