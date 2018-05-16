import React from 'react';
import PropTypes from 'prop-types';
import { turnPath } from './draw';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const RADIANS_TO_DEGREES = 180 / Math.PI;
const DEGREES_TO_RADIANS = Math.PI / 180;


const Mark = ({mark, ...props}) =>
  mark.match({
    Line(data){ return (<LineMark {...props} data={data}/>); },
    Turn(data){ return (<TurnMark {...props} data={data}/>); }
  });
Mark.propTypes = {
  mark: PropTypes.object.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

const LineMark = ({ isHighlighted, data, ...props }) => {
  const { from, to } = data;
  const className = cx('mark', 'mark--move', { 'mark--highlighted': isHighlighted });
  return (
    <g {...props} className={className}>
      <line className={cx('mark_hitbox')} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
      <line className={cx('mark_line')}   x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
    </g>
  );
};

const TurnMark = ({ isHighlighted, data, ...props }) => {
  const { from, degrees, position } = data;
  const className = cx('mark', 'mark--turn', { 'mark--highlighted': isHighlighted });

  return (
    <g
      {...props}
      className={className}
      transform={`translate(${position.x},${position.y})rotate(${RADIANS_TO_DEGREES * from})`}
    >
      <circle className={cx('mark_hitbox')} cx="0" cy="0" r="15"/>
      <path className={cx('mark_arrow')} d={turnPath(DEGREES_TO_RADIANS * degrees)}/>
    </g>
  );
};

export default Mark;
