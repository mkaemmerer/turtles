import React from 'react';
import PropTypes from 'prop-types';
import { safeLens } from 'utils/lenses';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Mark = ({mark, ...props}) =>
  mark.match({
    line(data){ return (<LineMark {...props} data={data}/>); },
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
    <g className={className} {...props}>
      <line className={cx('mark_hitbox')} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
      <line className={cx('mark_line')}   x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
    </g>
  );
};


const Drawing = ({output, onHoverChange, highlightedMarks}) => {
  const children = output.entries.map((entry, i) => {
    const {mark, lens} = entry;
    const isHighlighted = safeLens(lens, false).get(highlightedMarks);
    const onMouseEnter  = () => { onHoverChange(entry); };
    const onMouseLeave  = () => { onHoverChange(null);  };

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
  output: PropTypes.object.isRequired,
  onHoverChange: PropTypes.func.isRequired,
  highlightedMarks: PropTypes.array.isRequired
};

export default Drawing;
