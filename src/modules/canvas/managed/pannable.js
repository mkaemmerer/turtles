import React from 'react';
import { MakeDraggable } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';

const toVector = ({x,y}) => V2(x,y);

const ease = (t) =>
  (t<0.5)
    ? 2*t*t
    : -1+(4-2*t)*t;
const interpolate = (p1, p2) => {
  const v = V2.fromTo(p1, p2);
  return (t) => P2.offset(p1, V2.times(v,t));
};
const animate = (duration, handler) => {
  const startTime = performance.now();
  let animationFrame;
  const tick = (currentTime) => {
    const elapsed = (currentTime - startTime)/1000;
    handler(elapsed / duration);

    if(elapsed < duration) {
      animationFrame = window.requestAnimationFrame(tick);
    }
  };
  animationFrame = window.requestAnimationFrame(tick);

  return () => { window.cancelAnimationFrame(animationFrame); };
};

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
    componentWillUnmount() {
      this.stopAnimation();
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
      const interp = interpolate(this.state.viewOrigin, P2.origin);
      this.stopAnimation = animate(0.5, (t) => {
        this.setState({ viewOrigin: interp(ease(t)) });
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
