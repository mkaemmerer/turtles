import React from 'react';
import PropTypes from 'prop-types';
import Key from 'components/key';
import { Block } from './program';

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
  onMouseEnter = (lens) => {
    this.props.onHoverChange(lens);
  }
  onMouseLeave = () => {
    this.props.onHoverChange(null);
  }

  renderBlock() {
    const { program, onProgramChange } = this.props;
    return (
      <Block
        block={program}
        onChange={onProgramChange}
        onMouseEnter = {this.onMouseEnter}
        onMouseLeave = {this.onMouseLeave}
        onDistanceDragStart = {this.onDistanceDragStart}
        onDistanceDragEnd   = {this.onDistanceDragEnd}
        onDegreesDragStart  = {this.onDegreesDragStart}
        onDegreesDragEnd    = {this.onDegreesDragEnd}
      />
    );
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
          {this.renderBlock()}
        </div>
        <div className={cx('program_footer')}>
          {this.renderHint()}
        </div>
      </div>
    );
  }
}

export default Program;
