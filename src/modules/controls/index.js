import React from 'react';
import { ShapeArrowStraight, ShapeArrowCurved } from 'components/shapes';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Controls = ({ onMoveDragStart, onRotateDragStart }) => (
  <g className={cx('controls')}>
    <g
      className={cx('controls_handle')}
      transform="translate(40,0)rotate(90)"
      onMouseDown={onMoveDragStart}
    >
      <ShapeArrowStraight/>
    </g>
    <g
      className={cx('controls_handle')}
      transform="translate(-40,0)rotate(-90)"
      onMouseDown={onMoveDragStart}
    >
      <ShapeArrowStraight/>
    </g>


    <g
      className={cx('controls_handle')}
      transform="rotate(135)"
      onMouseDown={onRotateDragStart}
    >
      <ShapeArrowCurved/>
    </g>
    <g
      className={cx('controls_handle')}
      transform="rotate(-45)"
      onMouseDown={onRotateDragStart}
    >
      <ShapeArrowCurved/>
    </g>
  </g>
);

export default Controls;
