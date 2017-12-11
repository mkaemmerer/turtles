import React from 'react';
import PropTypes from 'prop-types';
import Command from './command';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const ProgramLine = ({ line, onLineChange, onMouseEnter, onMouseLeave, isHighlighted }) => {
  const { command, lens } = line;
  const className = cx('program_line', { 'program_line--highlighted': isHighlighted });
  const onCommandChange = (newCommand) => { onLineChange(lens, newCommand); };

  return (
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Command command={command} onCommandChange={onCommandChange}/>
    </div>
  );
};
ProgramLine.propTypes = {
  line:          PropTypes.object.isRequired,
  onLineChange:  PropTypes.func.isRequired,
  onMouseEnter:  PropTypes.func,
  onMouseLeave:  PropTypes.func,
  isHighlighted: PropTypes.bool.isRequired
};


class OptimizedProgramLine extends React.Component {
  onLineChange = (lens, command) => {
    this.props.onLineChange(lens, command);
  }
  onMouseEnter = () => {
    this.props.onMouseEnter();
  }
  onMouseLeave = () => {
    this.props.onMouseLeave();
  }

  shouldComponentUpdate(newProps) {
    const lineChanged      = newProps.line !== this.props.line;
    const highlightChanged = newProps.isHighlighted !== this.props.isHighlighted;
    return lineChanged || highlightChanged;
  }

  render() {
    const { line, isHighlighted } = this.props;
    return (
      <ProgramLine
        line={line}
        isHighlighted={isHighlighted}
        onLineChange={this.onLineChange}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />
    );
  }
}

export default OptimizedProgramLine;
