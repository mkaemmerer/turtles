import React from 'react';
import PropTypes from 'prop-types';


//By default, empty
const defaultSpec = {};
//By default, map onDragStart to onMouseDown
const defaultAdapter = (monitor) => ({
  isDragging:        monitor.isDragging(),
  dragOffset:        monitor.getDragOffset(),
  dragStartPosition: monitor.getDragStartPosition(),
  dragPosition:      monitor.getDragPosition(),
  onMouseDown:       monitor.onDragStart
});

//Accept an adapter to customize prop names as needed
const MakeDraggable = (spec = defaultSpec, adapter = defaultAdapter) => (Component) => {
  class Draggable extends React.Component {
    static contextTypes = {
      makeDragMonitor: PropTypes.func
    }

    constructor(props, context) {
      super(props, context);
      this.monitor = context.makeDragMonitor(this);
    }

    onDragStart() {
      if(spec.onDragStart) {
        spec.onDragStart(this.props, this.monitor, this.component);
      }
      this.forceUpdate();
    }
    onDrag() {
      if(spec.onDrag) {
        spec.onDrag(this.props, this.monitor, this.component);
      }
      this.forceUpdate();
    }
    onDragEnd() {
      if(spec.onDragEnd) {
        spec.onDragEnd(this.props, this.monitor, this.component);
      }
      this.forceUpdate();
    }

    render() {
      const ref = (component) => { this.component = component; };
      const adaptedProps = adapter(this.monitor);

      return (
        <Component ref={ref} {...this.props} {...adaptedProps} />
      );
    }
  }

  return Draggable;
};

export default MakeDraggable;
