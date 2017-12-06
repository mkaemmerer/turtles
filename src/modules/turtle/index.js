import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggable } from 'components/generic/draggable';
import { ShapeTurtle } from 'components/shapes';
import Controls from '../controls';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class Turtle extends React.Component {
  static propTypes = {
    onMouseDown: PropTypes.func,
    isDragging: PropTypes.bool,
    dragPosition: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onMouseDown, dragPosition } = this.props;
    const xPosition = dragPosition ? dragPosition.x : 0;

    return (
      <g
        className={cx('turtle')}
        transform={`translate(${xPosition}, 100)`}
        onMouseDown={onMouseDown}
      >
        <ShapeTurtle/>
        <Controls/>
      </g>
    );
  }
}

export default MakeDraggable()(Turtle);
