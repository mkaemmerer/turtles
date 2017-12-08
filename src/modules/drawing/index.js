import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Drawing = ({lines}) => {
  const children = lines.map((line, i) => (
    <line key={i} x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y}/>
  ));

  return (
    <g className={cx('drawing')}>
      {children}
    </g>
  );
}
Drawing.propTypes = {
  lines: PropTypes.array,
};

export default Drawing;
