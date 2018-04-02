import React from 'react';
import PropTypes from 'prop-types';
import { safeLens, indexLens, propertyLens, composeLens } from 'utils/lenses';
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

  renderLine(command, lens, i) {
    const {program, onProgramChange, onHoverChange, highlightedCommands} = this.props;

    const isHighlighted = safeLens(lens, false).get(highlightedCommands);
    const onCommandChange = (command) => {
      const newProgram = lens.set(program, command);
      onProgramChange(newProgram);
    };
    const onMouseEnter = () => { onHoverChange(command, lens); };
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
    return program.cmds.map((cmd, i) => {
      const lens = composeLens(
        safeLens(propertyLens('cmds'), []),
        indexLens(i)
      );
      return this.renderLine(cmd, lens, i);
    });
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
