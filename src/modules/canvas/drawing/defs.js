import React from 'react';

import styles from './highlight.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Markers = () => (
  <React.Fragment>
    <marker
      className={cx('highlight_arrowhead')}
      id="arrowhead-move"
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="4"
      markerHeight="4"
      orient="auto"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
    <marker
      className={cx('highlight_arrowhead')}
      id="arrowhead-turn"
      viewBox="0 0 10 10"
      refX="6"
      refY="3"
      markerWidth="4"
      markerHeight="4"
      orient="auto"
    >
      <path d="M 0 0 L 10 3 L 0 6 z" />
    </marker>
  </React.Fragment>
);

export default Markers;
