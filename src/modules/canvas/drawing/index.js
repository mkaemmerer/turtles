import React from 'react';
import PropTypes from 'prop-types';
import { indexLens, safeLens } from 'utils/lenses';
import { turnPath } from './draw';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const RADIANS_TO_DEGREES = 180 / Math.PI;


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
  const className = cx('mark', { 'mark--highlighted': isHighlighted });
  return (
    <g {...props} className={className}>
      <line className={cx('mark_hitbox')} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
      <line className={cx('mark_line')}   x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
    </g>
  );
};

const TurnMark = ({ isHighlighted, data, ...props }) => {
  const { from, to, position } = data;
  const className = cx('mark', { 'mark--highlighted': isHighlighted });

  return (
    <g
      {...props}
      className={className}
      transform={`translate(${position.x},${position.y})rotate(${from*RADIANS_TO_DEGREES})`}
    >
      <circle className={cx('mark_hitbox')} cx="0" cy="0" r="5"/>
      <path className={cx('mark_turn')} d={turnPath(to - from)}/>
    </g>
  );
};


const Drawing = ({marks, onHoverChange, highlightedMarks}) => {
  const children = marks.map((mark, i) => {
    const lens = indexLens(i);
    const isHighlighted = safeLens(lens, false).get(highlightedMarks);
    const onMouseEnter  = () => { onHoverChange(lens); };
    const onMouseLeave  = () => { onHoverChange(null); };

    return (
      <Mark
        key={i}
        mark={mark}
        isHighlighted={isHighlighted}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  });

  return (
    <g className={cx('drawing')}>
      {children}
    </g>
  );
}
Drawing.propTypes = {
  marks: PropTypes.array.isRequired,
  onHoverChange: PropTypes.func.isRequired,
  highlightedMarks: PropTypes.array.isRequired
};

export default Drawing;
