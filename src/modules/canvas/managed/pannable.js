import React from 'react';
import { MakeDraggable } from 'components/generic/draggable';
import { P2 } from 'utils/vectors';

//Panning
const panSpec = {
  onDragStart(props) {
    props.onPanDragStart();
  },
  onDrag(props, monitor) {
    const start = monitor.getDragPosition();
    const current = monitor.getDragStartPosition();
    props.onPanDrag(start, current);
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
  class ManagedCanvas extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        panOrigin: P2.origin
      };
    }

    onPanDragStart = () => {
    }
    onPanDrag = () => {
    }
    onPanDragEnd = () => {
    }

    render() {
      const { panOrigin } = this.state;

      return (
        <PannableCanvas
          {...this.props}
          panOrigin = {panOrigin}
          onPanDragStart = {this.onPanDragStart}
          onPanDrag      = {this.onPanDrag}
          onPanDragEnd   = {this.onPanDragEnd}
        />
      );
    }
  }
  return ManagedCanvas;
};

export default ManageState;
