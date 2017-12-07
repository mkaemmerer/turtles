import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggable } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Turtle from './turtle';
import Placement from './placement';

const toVector = ({x,y}) => new V2(x,y);

//Movement
const moveSpec = {
  onDragStart(props) {
    props.onMoveDragStart();
  },
  onDrag(props, monitor) {
    const offset = monitor.getDragOffset();
    props.onMoveDrag(offset);
  }
};
const moveAdapter = (monitor) => ({
  isMoveDragging:  monitor.isDragging(),
  onMoveDragStart: monitor.onDragStart
});
const Movable = MakeDraggable(moveSpec, moveAdapter);

//Rotation
const rotateSpec = {
  onDragStart(props) {
    props.onRotateDragStart();
  },
  onDrag(props, monitor) {
    const start = monitor.getDragPosition();
    const current = monitor.getDragStartPosition();
    props.onRotateDrag(start, current);
  }
};
const rotateAdapter = (monitor) => ({
  isRotateDragging:  monitor.isDragging(),
  onRotateDragStart: monitor.onDragStart
});
const Rotatable = MakeDraggable(rotateSpec, rotateAdapter);


//Component
const DraggableTurtle = Movable(Rotatable(Turtle));
class ManagedTurtle extends React.Component {
  static propTypes = {
    onMoveDragStart:   PropTypes.func,
    onRotateDragStart: PropTypes.func,
    dragPosition:      PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
      placement: new Placement(
        new P2(100, 100),
        V2.fromRotation(Math.PI/6)
      )
    };
  }

  onMoveDragStart = () => {
    this.placement = this.state.placement;
  }
  onRotateDragStart = () => {
    this.placement = this.state.placement;
  }
  onMoveDrag = (offset) => {
    const placement = this.placement.moveDir(toVector(offset));
    this.setState({ placement });
  }
  onRotateDrag = (start, current) => {
    const angle = P2.angleBetween(current, this.placement.position, start);
    const placement = this.placement.rotate(angle);
    this.setState({ placement });
  }

  render() {
    const { placement } = this.state;

    return (
      <DraggableTurtle
        placement={placement}
        onMoveDragStart={this.onMoveDragStart}
        onMoveDrag={this.onMoveDrag}
        onRotateDragStart={this.onRotateDragStart}
        onRotateDrag={this.onRotateDrag}
      />
    );
  }
}

export default ManagedTurtle;
