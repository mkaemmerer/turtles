import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggable } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Canvas from './canvas';

const RADIANS_TO_DEGREES = 180 / Math.PI;
const DEGREES_TO_RADIANS = Math.PI / 180;

const toVector = ({x,y}) => V2(x,y);
const roundDistance = (value, ctrlKey, shiftKey) => {
  const dist = Math.round(value);
  return withSnapping(dist, 10, 0.1, ctrlKey, shiftKey);
};
const roundDegrees  = (rads, ctrlKey, shiftKey) => {
  const degs = Math.round(rads * RADIANS_TO_DEGREES);
  return withSnapping(degs, 15, 0.5, ctrlKey, shiftKey) * DEGREES_TO_RADIANS;
};
const withSnapping = (value, increment, factor, ctrlKey, shiftKey) =>
  shiftKey
    ? Math.round(value * factor)
    : ctrlKey
      ? Math.round(value / increment) * increment
      : value;


//Movement
const moveSpec = {
  onDragStart(props) {
    props.onMoveDragStart();
  },
  onDrag(props, monitor) {
    const offset = monitor.getDragOffset();
    const ctrlKey = monitor.ctrlKey();
    const shiftKey = monitor.shiftKey();
    props.onMoveDrag(offset, ctrlKey, shiftKey);
  },
  onDragEnd(props) {
    props.onMoveDragEnd();
  }
};
const moveAdapter = (props, monitor) => ({
  isMoveDragging:  monitor.isDragging(),
  onMoveDragStart: monitor.onDragStart,
  ctrlKey:  monitor.ctrlKey() || props.ctrlKey || false,
  shiftKey: monitor.shiftKey() || props.shiftKey || false
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
    const ctrlKey = monitor.ctrlKey();
    const shiftKey = monitor.shiftKey();
    props.onRotateDrag(start, current, ctrlKey, shiftKey);
  },
  onDragEnd(props) {
    props.onRotateDragEnd();
  }
};
const rotateAdapter = (props, monitor) => ({
  isRotateDragging:  monitor.isDragging(),
  onRotateDragStart: monitor.onDragStart,
  ctrlKey:  monitor.ctrlKey() || props.ctrlKey || false,
  shiftKey: monitor.shiftKey() || props.shiftKey || false
});
const Rotatable = MakeDraggable(rotateSpec, rotateAdapter);


//Component
const DraggableCanvas = Movable(Rotatable(Canvas));
class ManagedCanvas extends React.Component {
  static propTypes = {
    placement: PropTypes.object.isRequired,
    onTurtleMoveStart:   PropTypes.func.isRequired,
    onTurtleMove:        PropTypes.func.isRequired,
    onTurtleMoveEnd:     PropTypes.func.isRequired,
    onTurtleRotateStart: PropTypes.func.isRequired,
    onTurtleRotate:      PropTypes.func.isRequired,
    onTurtleRotateEnd:   PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      previousPlacement: props.placement,
      movement: 0,
      rotation: 0
    };
  }

  onMoveDragStart = () => {
    this.setState({
      previousPlacement: this.props.placement,
      movement: 0,
      rotation: 0
    });
    this.props.onTurtleMoveStart();
  }
  onMoveDrag = (offset, ctrlKey, shiftKey) => {
    const { placement } = this.props;
    const dist         = V2.dot(placement.heading, toVector(offset));
    const movement     = roundDistance(dist, ctrlKey, shiftKey);
    this.setState({ movement });
    this.props.onTurtleMove(movement);
  }
  onMoveDragEnd = () => {
    const { movement } = this.state;
    this.props.onTurtleMoveEnd(movement);
  }

  onRotateDragStart = () => {
    this.setState({
      previousPlacement: this.props.placement,
      movement: 0,
      rotation: 0
    });
    this.props.onTurtleRotateStart();
  }
  onRotateDrag = (start, current, ctrlKey, shiftKey) => {
    const { placement } = this.props;
    const angle        = P2.angleBetween(current, placement.position, start);
    const rotation     = roundDegrees(angle, ctrlKey, shiftKey);
    this.setState({ rotation });
    this.props.onTurtleRotate(rotation);
  }
  onRotateDragEnd = () => {
    const { rotation } = this.state;
    this.props.onTurtleRotateEnd(rotation);
  }

  render() {
    const { placement } = this.props;
    const { previousPlacement, movement, rotation } = this.state;

    return (
      <DraggableCanvas
        {...this.props}
        previousPlacement = {previousPlacement}
        placement = {placement}
        movement  = {movement}
        rotation  = {rotation}
        onMoveDragStart   = {this.onMoveDragStart}
        onMoveDrag        = {this.onMoveDrag}
        onMoveDragEnd     = {this.onMoveDragEnd}
        onRotateDragStart = {this.onRotateDragStart}
        onRotateDrag      = {this.onRotateDrag}
        onRotateDragEnd   = {this.onRotateDragEnd}
      />
    );
  }
}

export default ManagedCanvas;
