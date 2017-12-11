import React from 'react';
import { V2 } from 'utils/vectors';
import { range } from 'utils/generators/fluent';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const RADIANS_TO_DEGREES = 180 / Math.PI;

const toTransform = ({position, heading}) => {
  const rotation = V2.toRotation(heading) * RADIANS_TO_DEGREES;
  return `translate(${position.x}, ${position.y})rotate(${rotation})`;
};
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

const RotationTicks = () => {
  const ticks = range(0, 24)
    .map((x) => {
      const transform = `rotate(${x * 360/24})translate(35,0)`;
      const rx = x % 6 === 0
        ? '3'
        : '1.5';
      const ry = '1';

      return (
        <ellipse key={x} transform={transform} rx={rx} ry={ry}/>
      );
    })
    .toArray();

  return (<g className={cx('guide_ticks')}>{ticks}</g>);
};

const Guides = ({ placement, movement, rotation, showMovement, showRotation }) => {
  const moveGuideClasses = cx(
    'guide',
    {
      'guide--visible': showMovement
    }
  );
  const rotateGuideClasses = cx(
    'guide',
    {
      'guide--visible': showRotation
    }
  );

  const arc = arcString(rotation);

  return (
    <g className={cx('guides')} transform={toTransform(placement)}>
      <g className={moveGuideClasses}>
        <text className={cx('guide_text')}>{movement}</text>
        <line className={cx('guide_line')} x1="-1000" y1="0" x2="1000" y2="0"/>
      </g>
      <g className={rotateGuideClasses}>
        <text className={cx('guide_text')}>{rotation}</text>
        <circle className={cx('guide_circle')} r="30"/>
        <path className={cx('guide_arc')} d={arc}/>
        <line className={cx('guide_line')} transform={toRotation(rotation)} x1="0" y1="0" x2="1000" y2="0"/>
        <RotationTicks/>
      </g>
    </g>
  );
};

export default Guides;
