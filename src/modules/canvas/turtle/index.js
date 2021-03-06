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

class Turtle extends React.PureComponent {
  static propTypes = {
    onMoveDragStart:   PropTypes.func,
    onRotateDragStart: PropTypes.func,
    isMoveDragging:    PropTypes.bool,
    isRotateDragging:  PropTypes.bool,
    placement: PropTypes.object
  }

  render() {
    const {
      onMoveDragStart,
      isMoveDragging,
      onRotateDragStart,
      isRotateDragging,
      placement
    } = this.props;
    return (
      <g className={cx('turtle')} transform={toTransform(placement)}>
        <ShapeTurtle/>
        <Controls
          onMoveDragStart={onMoveDragStart}
          onRotateDragStart={onRotateDragStart}
          showRotation={!isMoveDragging}
          showMovement={!isRotateDragging}
        />
      </g>
    );
  }
}

export default Turtle;
