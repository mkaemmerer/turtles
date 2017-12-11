import React from 'react';
import PropTypes from 'prop-types';
import Drawing from './drawing';
import Turtle from './turtle';
import Guides from './guides';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class Canvas extends React.Component {
  static propTypes = {
    //Turtle placement
    placement: PropTypes.object.isRequired,
    movement:  PropTypes.number.isRequired,
    rotation:  PropTypes.number.isRequired,
    //Turtle dragging
    onMoveDragStart:   PropTypes.func,
    onRotateDragStart: PropTypes.func,
    isMoveDragging:    PropTypes.bool.isRequired,
    isRotateDragging:  PropTypes.bool.isRequired,
    ctrlKey:  PropTypes.bool.isRequired,
    shiftKey: PropTypes.bool.isRequired,
    //Drawing
    output:           PropTypes.object.isRequired,
    highlightedMarks: PropTypes.array.isRequired,
    onHoveredMarkChange: PropTypes.func.isRequired
  }

  render() {
    const {
      placement,
      movement,
      rotation,
      output,
      highlightedMarks,
      onHoveredMarkChange,
      onMoveDragStart,
      onRotateDragStart,
      isMoveDragging,
      isRotateDragging
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
          onMoveDragStart   = {onMoveDragStart}
          onRotateDragStart = {onRotateDragStart}
          isMoveDragging    = {isMoveDragging}
          isRotateDragging  = {isRotateDragging}
        />
        <Guides
          placement={placement}
          movement={movement}
          rotation={rotation}
          showRotation={isRotateDragging}
          showMovement={isMoveDragging}
        />
      </svg>
    );
  }
}

export default Canvas;
