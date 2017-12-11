import React from 'react';
import { range } from 'utils/generators/fluent';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const ticks = range(-100, 100)
  .map((x) => {
    const transform = `translate(${x * 10})`;
    const rx = '1';
    const ry = x % 10 === 0
      ? '3'
      : '1';

    return (
      <ellipse className={cx('guide_shape')} key={x} transform={transform} rx={rx} ry={ry}/>
    );
  })
  .toArray();

const MovementGuide = ({ movement, show, showTicks }) => {
  const className = cx(
    'guide',
    {
      'guide--visible': show,
      'guide--show-ticks': showTicks,
      'guide--show-path':  !showTicks
    }
  );

  return (
    <g className={className}>
      <text className={cx('guide_text')}>{movement}</text>
      <g className={cx('guide_ticks')}>
        {ticks}
      </g>
      <g className={cx('guide_path')}>
        <line className={cx('guide_line')} x1="-1000" y1="0" x2="1000" y2="0"/>
      </g>
    </g>
  );
};

export default MovementGuide;
