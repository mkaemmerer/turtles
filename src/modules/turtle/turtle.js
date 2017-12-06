import React from 'react';
import PropTypes from 'prop-types';
import { V2 } from 'utils/vectors';
import { ShapeTurtle } from 'components/shapes';
import Controls from '../controls';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const toTransform = ({position, heading}) => {
  const rotation = V2.toRotation(heading) * 180 / Math.PI;
  return `translate(${position.x}, ${position.y})rotate(${rotation})`;
}

const Turtle = ({ onMouseDown, placement }) => (
  <g
    className={cx('turtle')}
    transform={toTransform(placement)}
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
