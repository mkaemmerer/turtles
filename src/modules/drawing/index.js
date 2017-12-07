import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const toPathString = (path) =>
  'M' + path.map((p) => `${p.position.x}, ${p.position.y}`).join(' L ');

const Drawing = ({placements}) => {
  const pathString = toPathString(placements);

  return (
    <path className={cx('drawing')} d={pathString}/>
  );
}
Drawing.propTypes = {
  placements: PropTypes.array,
};

export default Drawing;
