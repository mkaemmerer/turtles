import React from 'react';
import PropTypes from 'prop-types';
import { safeLens } from 'utils/lenses';
import Key from 'components/key';
import ProgramLine from './line';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class Program extends React.Component {
  static propTypes = {
    program: PropTypes.object.isRequired,
    onProgramChange: PropTypes.func.isRequired,
    onHoverChange: PropTypes.func.isRequired,
    highlightedCommands: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      isDraggingDistance: false,
      isDraggingDegrees:  false
    };
  }

  onDistanceDragStart = () => {
    this.setState({ isDraggingDistance: true });
  }
  onDistanceDragEnd = () => {
    this.setState({ isDraggingDistance: false });
  }
  onDegreesDragStart = () => {
    this.setState({ isDraggingDegrees: true });
  }
  onDegreesDragEnd = () => {
    this.setState({ isDraggingDegrees: false });
  }

  renderLine(line, i) {
    const {program, onProgramChange, onHoverChange, highlightedCommands} = this.props;
    const { command, lens } = line;

    const isHighlighted = safeLens(lens, false).get(highlightedCommands);
    const onCommandChange = (command) => {
      const newProgram = lens.set(program, command);
      onProgramChange(newProgram);
    };
    const onMouseEnter = () => { onHoverChange(line); };
    const onMouseLeave = () => { onHoverChange(null); };

    return (
      <ProgramLine
        key={i}
        command={command}
        isHighlighted={isHighlighted}
        onCommandChange={onCommandChange}
        onMouseEnter = {onMouseEnter}
        onMouseLeave = {onMouseLeave}
        onDistanceDragStart = {this.onDistanceDragStart}
        onDistanceDragEnd   = {this.onDistanceDragEnd}
        onDegreesDragStart  = {this.onDegreesDragStart}
        onDegreesDragEnd    = {this.onDegreesDragEnd}
      />
    );
  }
  renderLines() {
    const { program } = this.props;
    return program.lines().map((line, i) => this.renderLine(line, i));
  }
  renderHint() {
    const { isDraggingDistance, isDraggingDegrees } = this.state;

    if(isDraggingDistance) {
      return (
        <div>
          <span><Key name="Ctrl"/>: Snap to nearest 10</span>,&nbsp;&nbsp;
          <span><Key name="Shift"/>: Fine tune</span>
        </div>
      );
    }
    if(isDraggingDegrees) {
      return (
        <div>
          <span><Key name="Ctrl"/>: Snap to nearest 15</span>,&nbsp;&nbsp;
          <span><Key name="Shift"/>: Fine tune</span>
        </div>
      );
    }

    return null;
  }
  render() {
    return (
      <div className={cx('program')}>
        <div className={cx('program_lines')}>
          {this.renderLines()}
        </div>
        <div className={cx('program_footer')}>
          {this.renderHint()}
        </div>
      </div>
    );
  }
}

export default Program;
