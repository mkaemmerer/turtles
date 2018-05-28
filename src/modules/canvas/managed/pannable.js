import React from 'react';
import { MakeDraggable } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';

const toVector = ({x,y}) => V2(x,y);


//Panning
const panSpec = {
  onDragStart(props) {
    props.onPanStart();
  },
  onDrag(props, monitor) {
    const offset = monitor.getDragOffset();
    props.onPan(offset);
  },
  onDragEnd(props) {
    props.onPanEnd();
  }
};
const panAdapter = (props, monitor) => ({
  isPanning:  monitor.isDragging(),
  onPanStart: monitor.onDragStart
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

    onPanStart = () => {
      this.origin = this.state.viewOrigin;
    }
    onPan = (offset) => {
      const vector = toVector(offset);
      this.setState({
        viewOrigin: P2.offset(this.origin, vector)
      });
    }
    onPanEnd = () => {
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
          onPanStart = {this.onPanStart}
          onPan      = {this.onPan}
          onPanEnd   = {this.onPanEnd}
          onPanRecenter  = {this.onPanRecenter}
        />
      );
    }
  }
  return ManagedPannableCanvas;
};

export default ManageState;
