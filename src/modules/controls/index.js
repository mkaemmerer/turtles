import React from 'react';
import { ShapeArrowStraight, ShapeArrowCurved } from 'components/shapes';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Controls = () => (
  <g className={cx('controls')}>
    <g className={cx('controls_handle')} transform="translate(40,0)rotate(90)">   <ShapeArrowStraight/> </g>
    <g className={cx('controls_handle')} transform="translate(-40,0)rotate(-90)"> <ShapeArrowStraight/> </g>
    <g className={cx('controls_handle')} transform="rotate(135)">                 <ShapeArrowCurved/>   </g>
    <g className={cx('controls_handle')} transform="rotate(-45)">                 <ShapeArrowCurved/>   </g>
  </g>
);

export default Controls;
