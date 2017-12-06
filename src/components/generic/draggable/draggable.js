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
      this.monitor = context.makeDragMonitor();
    }
    componentWillReceiveProps() {
      const isDragging = this.monitor.isDragging();
      const dragOffset = this.monitor.getDragOffset();

      if(isDragging && !this.isDragging) {
        if(spec.onDragStart) {
          spec.onDragStart(this.props, this.monitor, this.component);
        }
      }

      if(isDragging && dragOffset !== this.dragOffset) {
        if(spec.onDrag) {
          spec.onDrag(this.props, this.monitor, this.component);
        }
      }

      if(!isDragging && this.isDragging) {
        if(spec.onDragEnd) {
          spec.onDragEnd(this.props, this.monitor, this.component);
        }
      }

      //Store last values so we can tell if they change
      this.isDragging = isDragging;
      this.dragOffset = dragOffset;
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
