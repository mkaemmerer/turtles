import React from 'react';
import PropTypes from 'prop-types';


//By default, map onDragStart to onMouseDown
const defaultAdapter = ({ onDragStart, ...props }) => ({
  onMouseDown: onDragStart,
  ...props
});

//Accept an adapter to customize prop names as needed
const MakeDraggable = (adapter = defaultAdapter) => (Component) => {
  class Draggable extends React.Component {
    static contextTypes = {
      makeDragMonitor: PropTypes.func
    }

    constructor(props, context) {
      super(props, context);
      this.monitor = context.makeDragMonitor();
    }
    componentWillReceiveProps() {
      this.forceUpdate();
    }

    render() {
      const adaptedProps = adapter({
        isDragging:        this.monitor.isDragging(),
        dragOffset:        this.monitor.getDragOffset(),
        dragStartPosition: this.monitor.getDragStartPosition(),
        dragPosition:      this.monitor.getDragPosition(),
        onDragStart: this.monitor.startDrag
      });

      return (
        <Component {...this.props} {...adaptedProps} />
      );
    }
  }

  return Draggable;
};

export default MakeDraggable;
