import React from 'react';
import PropTypes from 'prop-types';
import { V2 } from 'utils/vectors';
import MovementGuide from './movement-guide';
import RotationGuide from './rotation-guide';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const RADIANS_TO_DEGREES = 180 / Math.PI;

const toTransform = ({position, heading}) => {
  const rotation = V2.toRotation(heading) * RADIANS_TO_DEGREES;
  return `translate(${position.x}, ${position.y})rotate(${rotation})`;
};


const Guides = ({ placement, movement, rotation, showMovement, showRotation, showTicks }) => (
  <g className={cx('guides')} transform={toTransform(placement)}>
    <MovementGuide show={showMovement} showTicks={showTicks} movement={movement}/>
    <RotationGuide show={showRotation} showTicks={showTicks} rotation={rotation}/>
  </g>
);
Guides.propTypes = {
  placement: PropTypes.object.isRequired,
  movement: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  showMovement: PropTypes.bool.isRequired,
  showRotation: PropTypes.bool.isRequired,
  showTicks:    PropTypes.bool.isRequired
};

export default Guides;
