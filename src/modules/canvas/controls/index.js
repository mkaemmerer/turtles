import React from 'react';
import PropTypes from 'prop-types';
import {
  ShapeMoveForward,
  ShapeMoveBackward,
  ShapeRotateLeft,
  ShapeRotateRight
} from './shapes';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Controls = ({ onMoveDragStart, onRotateDragStart, showMovement, showRotation }) => {
  const moveHandleClasses = cx(
    'controls_handle',
    {
      'controls_handle--visible': showMovement
    }
  );
  const rotateHandleClasses = cx(
    'controls_handle',
    {
      'controls_handle--visible': showRotation
    }
  );

  return (
    <g className={cx('controls')}>
      <g className={moveHandleClasses} onMouseDown={onMoveDragStart}>
        <ShapeMoveForward/>
      </g>
      <g className={moveHandleClasses} onMouseDown={onMoveDragStart}>
        <ShapeMoveBackward/>
      </g>

      <g className={rotateHandleClasses} onMouseDown={onRotateDragStart}>
        <ShapeRotateLeft/>
      </g>
      <g className={rotateHandleClasses} onMouseDown={onRotateDragStart}>
        <ShapeRotateRight/>
      </g>
    </g>
  )
};
Controls.PropTypes = {
  onMoveDragStart:   PropTypes.func,
  onRotateDragStart: PropTypes.func,
  showMovement:      PropTypes.bool,
  showRotation:      PropTypes.bool
};


class OptimizedControls extends React.PureComponent {
  render() {
    return (<Controls {...this.props}/>);
  }
}
export default OptimizedControls;
