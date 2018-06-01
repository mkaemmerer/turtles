import React from 'react';
import PropTypes from 'prop-types';
import match from 'lang/match';
import { linePath, turnPath } from './draw-path';

import styles from './highlight.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const RADIANS_TO_DEGREES = 180 / Math.PI;
const DEGREES_TO_RADIANS = Math.PI / 180;

const Highlight = ({mark, ...props}) =>
  match(mark, {
    'Mark.Line'(data){ return (<LineHighlight {...props} data={data}/>); },
    'Mark.Turn'(data){ return (<TurnHighlight {...props} data={data}/>); }
  });
Highlight.propTypes = {
  mark: PropTypes.object.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

const LineHighlight = ({ isHighlighted, data, ...props }) => {
  const { from, to } = data;
  const className = cx('highlight', 'highlight--line', { 'highlight--highlighted': isHighlighted });
  return (
    <g {...props} className={className}>
      <line className={cx('highlight_hitbox')}    x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
      <path className={cx('highlight_path')} d={linePath(from, to)} />
    </g>
  );
};

const TurnHighlight = ({ isHighlighted, data, ...props }) => {
  const { from, degrees, position } = data;
  const className = cx('highlight', 'highlight--turn', { 'highlight--highlighted': isHighlighted });
  return (
    <g
      {...props}
      className={className}
      transform={`translate(${position.x},${position.y})rotate(${RADIANS_TO_DEGREES * from})`}
    >
      <circle className={cx('highlight_hitbox')} cx="0" cy="0" r="1"/>
      <path className={cx('highlight_path')} d={turnPath(DEGREES_TO_RADIANS * degrees)}/>
    </g>
  );
};

export default Highlight;
