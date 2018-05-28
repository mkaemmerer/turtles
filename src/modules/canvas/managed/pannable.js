import React from 'react';
import { MakeDraggable } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';

const toVector = ({x,y}) => V2(x,y);


//Panning
const panSpec = {
  onDragStart(props) {
    props.onPanDragStart();
  },
  onDrag(props, monitor) {
    const offset = monitor.getDragOffset();
    props.onPanDrag(offset);
  },
  onDragEnd(props) {
    props.onPanDragEnd();
  }
};
const panAdapter = (props, monitor) => ({
  isPanDragging:  monitor.isDragging(),
  onPanDragStart: monitor.onDragStart
});
const Pannable = MakeDraggable(panSpec, panAdapter);

//Component
const ManageState = (Canvas) => {
  const PannableCanvas = Pannable(Canvas);
  class ManagedPannableCanvas extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        viewOrigin: P2.origin
      };
    }

    onPanDragStart = () => {
      this.origin = this.state.viewOrigin;
    }
    onPanDrag = (offset) => {
      const vector = toVector(offset);
      this.setState({
        viewOrigin: P2.offset(this.origin, vector)
      });
    }
    onPanDragEnd = () => {
    }
    onPanRecenter = () => {
      this.setState({
        viewOrigin: P2.origin
      });
    }

    render() {
      const { viewOrigin } = this.state;

      return (
        <PannableCanvas
          {...this.props}
          viewOrigin = {viewOrigin}
          onPanDragStart = {this.onPanDragStart}
          onPanDrag      = {this.onPanDrag}
          onPanDragEnd   = {this.onPanDragEnd}
          onPanRecenter  = {this.onPanRecenter}
        />
      );
    }
  }
  return ManagedPannableCanvas;
};

export default ManageState;
