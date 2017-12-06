import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggable } from 'components/generic/draggable';
import Turtle from './turtle';

const spec = {
  onDrag(props, monitor, component) {
    component.onDrag(monitor.getDragOffset());
  },
  onDragStart(props, monitor, component) {
    component.onDragStart(monitor.getDragPosition());
  },
  onDragEnd(props, monitor, component) {
    component.onDragEnd();
  }
};
class DraggableTurtle extends React.Component {
  static propTypes = {
    onMouseDown: PropTypes.func,
    dragPosition: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
      position: {x: 100, y: 100}
    };
  }

  onDragStart(dragPosition) {
    this.dragPosition = dragPosition
  }
  onDrag(dragOffset) {
    const position = {
      x: this.dragPosition.x + dragOffset.x,
      y: this.dragPosition.y + dragOffset.y
    };
    this.setState({position});
  }
  onDragEnd() {
  }

  render() {
    const { onMouseDown } = this.props;
    const { position } = this.state;

    return (
      <Turtle position={position} onMouseDown={onMouseDown}/>
    );
  }
}

export default MakeDraggable(spec)(DraggableTurtle);
