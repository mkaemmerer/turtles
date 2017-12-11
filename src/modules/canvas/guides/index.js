import React from 'react';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

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

const Guides = ({ movement, rotation, showMovement, showRotation }) => {
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

  const arc = arcString(-rotation);

  return (
    <g className={cx('guides')}>
      <g className={moveGuideClasses}>
        <text className={cx('guide_text')}>{movement}</text>
        <line className={cx('guide_line')} x1="-1000" y1="0" x2="1000" y2="0"/>
      </g>
      <g className={rotateGuideClasses}>
        <text className={cx('guide_text')}>{rotation}</text>
        <circle className={cx('guide_circle')} r="30"/>
        <path className={cx('guide_arc')} d={arc}/>
        <line className={cx('guide_line')} x1="0" y1="0" x2="1000" y2="0"/>
      </g>
    </g>
  );
};

export default Guides;
