import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggable } from 'components/generic/draggable';
import { V2 } from 'utils/vectors';
import Turtle from './turtle';
import Placement from './placement';

const toVector = ({x,y}) => new V2(x,y);

const spec = {
  onDragStart(props, monitor, component) {
    component.onDragStart();
  },
  onDrag(props, monitor, component) {
    const offset = monitor.getDragOffset();
    component.onDrag(toVector(offset));
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
      placement: Placement.defaultPlacement
    };
  }

  onDragStart() {
    this.placement = this.state.placement;
  }
  onDrag(direction) {
    const placement = this.placement.moveDir(direction);
    this.setState({ placement });
  }
  onDragEnd() {
  }

  render() {
    const { onMouseDown } = this.props;
    const { placement } = this.state;

    return (
      <Turtle placement={placement} onMouseDown={onMouseDown}/>
    );
  }
}

export default MakeDraggable(spec)(DraggableTurtle);
