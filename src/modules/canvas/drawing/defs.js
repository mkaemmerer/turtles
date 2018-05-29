import React from 'react';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Markers = () => (
  <React.Fragment>
    <marker
      className={cx('mark_arrowhead')}
      id="arrowhead"
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="4"
      markerHeight="4"
      orient="auto"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
  </React.Fragment>
);

export default Markers;
