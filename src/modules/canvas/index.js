import React from 'react';
import PropTypes from 'prop-types';
import Turtle from './turtle';
import Drawing from './drawing';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class Canvas extends React.Component {
  static propTypes = {
    placement:        PropTypes.object.isRequired,
    output:           PropTypes.object.isRequired,
    highlightedMarks: PropTypes.array.isRequired,
    onHoveredMarkChange: PropTypes.func.isRequired,
    onTurtleMoveStart:   PropTypes.func.isRequired,
    onTurtleMove:        PropTypes.func.isRequired,
    onTurtleMoveEnd:     PropTypes.func.isRequired,
    onTurtleRotateStart: PropTypes.func.isRequired,
    onTurtleRotate:      PropTypes.func.isRequired,
    onTurtleRotateEnd:   PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      placement,
      output,
      highlightedMarks,
      onHoveredMarkChange,
      onTurtleMoveStart,
      onTurtleMove,
      onTurtleMoveEnd,
      onTurtleRotateStart,
      onTurtleRotate,
      onTurtleRotateEnd
    } = this.props;

    return (
      <svg className={cx('canvas')}>
        <Drawing
          output={output}
          onHoverChange={onHoveredMarkChange}
          highlightedMarks={highlightedMarks}
        />
        <Turtle
          placement={placement}
          onTurtleMoveStart = {onTurtleMoveStart}
          onTurtleMove      = {onTurtleMove}
          onTurtleMoveEnd   = {onTurtleMoveEnd}
          onTurtleRotateStart = {onTurtleRotateStart}
          onTurtleRotate      = {onTurtleRotate}
          onTurtleRotateEnd   = {onTurtleRotateEnd}
        />
      </svg>
    );
  }
}

export default Canvas;
