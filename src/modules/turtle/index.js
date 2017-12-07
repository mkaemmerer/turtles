import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggable } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Turtle from './turtle';

const RADIANS_TO_DEGREES = 180 / Math.PI;
const DEGREES_TO_RADIANS = Math.PI / 180;

const toVector = ({x,y}) => new V2(x,y);
const roundDistance = (dist) => Math.round(dist);
const roundDegrees  = (rads) => Math.round(rads * RADIANS_TO_DEGREES) * DEGREES_TO_RADIANS;

//Movement
const moveSpec = {
  onDragStart(props) {
    props.onMoveDragStart();
  },
  onDrag(props, monitor) {
    const offset = monitor.getDragOffset();
    props.onMoveDrag(offset);
  },
  onDragEnd(props) {
    props.onMoveDragEnd();
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
  },
  onDragEnd(props) {
    props.onRotateDragEnd();
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
    placement:      PropTypes.object.isRequired,
    onTurtleMove:   PropTypes.func.isRequired,
    onTurtleRotate: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      placement: props.placement,
      movement: 0,
      rotation: 0
    };
  }
  componentWillReceiveProps(newProps) {
    if(newProps.placement !== this.props.placement) {
      this.setState({ placement: newProps.placement });
    }
  }

  onMoveDragStart = () => {
  }
  onMoveDrag = (offset) => {
    const { placement } = this.props;
    const movement     = roundDistance(V2.dot(placement.heading, toVector(offset)));
    const newPlacement = placement.move(movement);
    this.setState({
      placement: newPlacement,
      movement
    });
  }
  onMoveDragEnd = () => {
    const { movement } = this.state;
    this.props.onTurtleMove(movement);
  }

  onRotateDragStart = () => {
  }
  onRotateDrag = (start, current) => {
    const { placement } = this.props;
    const rotation     = roundDegrees(P2.angleBetween(current, placement.position, start));
    const newPlacement = placement.rotate(rotation);
    this.setState({
      placement: newPlacement,
      rotation
    });
  }
  onRotateDragEnd = () => {
    const { rotation } = this.state;
    this.props.onTurtleRotate(rotation);
  }

  render() {
    const { placement, movement, rotation } = this.state;

    return (
      <DraggableTurtle
        placement={placement}
        movement={movement}
        rotation={rotation}
        onMoveDragStart={this.onMoveDragStart}
        onMoveDrag={this.onMoveDrag}
        onMoveDragEnd={this.onMoveDragEnd}
        onRotateDragStart={this.onRotateDragStart}
        onRotateDrag={this.onRotateDrag}
        onRotateDragEnd={this.onRotateDragEnd}
      />
    );
  }
}

export default ManagedTurtle;
