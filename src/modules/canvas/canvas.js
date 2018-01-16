import React from 'react';
import PropTypes from 'prop-types';
import Key from 'components/key';
import Drawing from './drawing';
import Turtle from './turtle';
import Guides from './guides';
import Hint from './hint';

import styles from './canvas.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class Canvas extends React.Component {
  static propTypes = {
    //Turtle placement
    placement:         PropTypes.object.isRequired,
    previousPlacement: PropTypes.object.isRequired,
    movement:          PropTypes.number.isRequired,
    rotation:          PropTypes.number.isRequired,
    //Turtle dragging
    onMoveDragStart:   PropTypes.func,
    onRotateDragStart: PropTypes.func,
    isMoveDragging:    PropTypes.bool.isRequired,
    isRotateDragging:  PropTypes.bool.isRequired,
    ctrlKey:  PropTypes.bool.isRequired,
    shiftKey: PropTypes.bool.isRequired,
    //Drawing
    marks:            PropTypes.array.isRequired,
    highlightedMarks: PropTypes.array.isRequired,
    onHoveredMarkChange: PropTypes.func.isRequired
  }

  render() {
    const {
      placement,
      previousPlacement,
      movement,
      rotation,
      marks,
      highlightedMarks,
      onHoveredMarkChange,
      onMoveDragStart,
      onRotateDragStart,
      isMoveDragging,
      isRotateDragging,
      ctrlKey,
      shiftKey
    } = this.props;

    return (
      <div className={cx('canvas')}>
        <svg className={cx('canvas_inner')}>
          <Drawing
            marks={marks}
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
            placement={previousPlacement}
            movement={movement}
            rotation={rotation}
            showRotation={isRotateDragging}
            showMovement={isMoveDragging}
            showTicks={ctrlKey && !shiftKey}
          />
        </svg>

        <div className={cx('canvas_overlay')}>
          <div className={cx('canvas_overlay-footer')}>
            <Hint isVisible={isMoveDragging}>
              <span><Key name="Ctrl"/>: Snap to nearest 10</span>
              <span><Key name="Shift"/>: Fine tune</span>
            </Hint>
            <Hint isVisible={isRotateDragging}>
              <span><Key name="Ctrl"/>: Snap to nearest 15</span>
              <span><Key name="Shift"/>: Fine tune</span>
            </Hint>
          </div>
        </div>
      </div>
    );
  }
}

export default Canvas;
