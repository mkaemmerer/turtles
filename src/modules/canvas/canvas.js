import React from 'react';
import PropTypes from 'prop-types';
import FloatingButton from 'components/floating-button';
import { IconCrosshairs } from 'components/icon';
import Key from 'components/key';
import { Drawing, DrawingDefs } from './drawing';
import Turtle from './turtle';
import Guides from './guides';
import Hint from './hint';

import styles from './canvas.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const CanvasBackground = (props) => (
  <rect
    className={cx('canvas_background')}
    x="0"
    y="0"
    width="100%"
    height="100%"
    {...props}
  />
);

class Canvas extends React.PureComponent {
  static propTypes = {
    //Canvas size
    canvasRef: PropTypes.func,
    //Turtle placement
    placement:         PropTypes.object.isRequired,
    previousPlacement: PropTypes.object.isRequired,
    movement:          PropTypes.number.isRequired,
    rotation:          PropTypes.number.isRequired,
    //Turtle dragging
    onMoveDragStart:   PropTypes.func.isRequired,
    onRotateDragStart: PropTypes.func.isRequired,
    isMoveDragging:    PropTypes.bool.isRequired,
    isRotateDragging:  PropTypes.bool.isRequired,
    ctrlKey:  PropTypes.bool.isRequired,
    shiftKey: PropTypes.bool.isRequired,
    //View panning
    viewOrigin:    PropTypes.object.isRequired,
    onPanStart:    PropTypes.func.isRequired,
    onPanRecenter: PropTypes.func.isRequired,
    isPanning:     PropTypes.bool.isRequired,
    //Drawing
    marks:            PropTypes.array.isRequired,
    highlightedMarks: PropTypes.array.isRequired,
    onHoveredMarkChange: PropTypes.func.isRequired
  }

  render() {
    const {
      canvasRef,
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
      viewOrigin,
      onPanStart,
      onPanRecenter,
      isPanning,
      ctrlKey,
      shiftKey
    } = this.props;
    const className = cx('canvas', { 'canvas--is-panning': isPanning });

    return (
      <div className={className} ref={canvasRef}>
        <svg className={cx('canvas_inner')}>
          <defs>
            <DrawingDefs/>
          </defs>
          <CanvasBackground onMouseDown={onPanStart}/>
          <g transform={`translate(${viewOrigin.x}, ${viewOrigin.y})`}>
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
          </g>
        </svg>

        <div className={cx('canvas_overlay')}>
          <div className={cx('canvas_overlay-hud')}>
            <FloatingButton onClick={onPanRecenter}>
              <IconCrosshairs size="s"/>&nbsp;Recenter
            </FloatingButton>
          </div>
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
