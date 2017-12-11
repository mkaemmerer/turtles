import React from 'react';
import { range } from 'utils/generators/fluent';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const RADIANS_TO_DEGREES = 180 / Math.PI;

const toRotation = (rotation) => {
  return `rotate(${rotation * RADIANS_TO_DEGREES})`;
};

const arcString = (arc) => {
  //Normalize arc to something between -2PI and 2PI
  arc = arc % (2*Math.PI);

  const r = 30;
  const x = r * Math.cos(arc);
  const y = r * Math.sin(arc);
  const dir   = arc > 0 ? 1 : 0;
  const sweep = (Math.abs(arc) > Math.PI) ? 1 : 0;

  return `
    M 0 0
    L ${r} 0
    A ${r} ${r} 0 ${sweep} ${dir} ${x} ${y}
    Z
  `;
}

const ticks = range(0, 24)
  .map((x) => {
    const transform = `rotate(${x * 360/24})translate(30,0)`;
    const rx = x % 6 === 0
      ? '3'
      : '1';
    const ry = '1';

    return (
      <ellipse className={cx('guide_shape')} key={x} transform={transform} rx={rx} ry={ry}/>
    );
  })
  .toArray();


const RotationGuide = ({ rotation, show, showTicks }) => {
  const className = cx(
    'guide',
    {
      'guide--visible':    show,
      'guide--show-ticks': showTicks,
      'guide--show-path':  !showTicks
    }
  );

  const arc = arcString(rotation);

  return (
    <g className={className}>
      <text className={cx('guide_text')}>{rotation}</text>

      <g className={cx('guide_ticks')}>
        {ticks}
      </g>
      <g className={cx('guide_path')}>
        <circle className={cx('guide_line')} r="30"/>
      </g>

      <line className={cx('guide_line')} transform={toRotation(rotation)} x1="0" y1="0" x2="1000" y2="0"/>
      <path className={cx('guide_arc')} d={arc}/>
    </g>
  );
};

export default RotationGuide;
