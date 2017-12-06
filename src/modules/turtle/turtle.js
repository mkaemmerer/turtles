import React from 'react';
import PropTypes from 'prop-types';
import { ShapeTurtle } from 'components/shapes';
import Controls from '../controls';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Turtle = ({ onMouseDown, placement }) => (
  <g
    className={cx('turtle')}
    transform={`translate(${placement.position.x}, ${placement.position.y})`}
    onMouseDown={onMouseDown}
  >
    <ShapeTurtle/>
    <Controls/>
  </g>
);
Turtle.propTypes = {
  onMouseDown: PropTypes.func,
  placement:    PropTypes.object
}

export default Turtle;
