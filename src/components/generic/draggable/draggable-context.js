import React from 'react';
import PropTypes from 'prop-types';


//By default, map to mouseUp and mouseMove
const defaultAdapter = ({ onDragMove, onDragEnd }) => ({
  onMouseMove: onDragMove,
  onMouseUp:   onDragEnd
});

//Accept an adapter to customize prop names as needed
const MakeDraggableContext = (adapter = defaultAdapter) => (Container) => {
  class DragContainer extends React.Component {
    static childContextTypes = {
      makeDragMonitor: PropTypes.func
    }
    getChildContext() {
      return {
        makeDragMonitor: this.makeDragMonitor
      };
    }

    constructor() {
      super();

      this.dragState = {
        isDragging:        false,
        component:         null,
        dragStartPosition: null,
        dragPosition:      null,
        dragOffset:        null,
      };
    }

    makeDragMonitor = (component) => {
      const whenActive = (x, d) => () => {
        return (component === this.dragState.component)
          ? x()
          : d;
      };

      return {
        isDragging:           whenActive(() => this.dragState.isDragging,        false),
        getDragOffset:        whenActive(() => this.dragState.dragOffset,        null),
        getDragStartPosition: whenActive(() => this.dragState.dragStartPosition, null),
        getDragPosition:      whenActive(() => this.dragState.dragPosition,      null),
        onDragStart:          (e) => { this.onDragStart(e, component); }
      };
    }

    onDragStart = (e, component) => {
      if(this.dragState.isDragging) { return; }

      this.dragState = {
        isDragging: true,
        component,
        dragStartPosition: {x: e.clientX, y: e.clientY},
        dragPosition:      {x: e.clientX, y: e.clientY},
        dragOffset:        {x: 0, y: 0},
      };

      component.onDragStart();
    }
    onDragMove = (e) => {
      if(!this.dragState.isDragging) { return; }

      const { dragStartPosition, component } = this.dragState;
      const dragPosition = {
        x: e.clientX,
        y: e.clientY
      };
      const dragOffset = {
        x: dragPosition.x - dragStartPosition.x,
        y: dragPosition.y - dragStartPosition.y
      };
      this.dragState.dragPosition = dragPosition;
      this.dragState.dragOffset   = dragOffset;

      component.onDrag();
    }
    onDragEnd = () => {
      if(!this.dragState.isDragging) { return; }

      const { component } = this.dragState;
      this.dragState = {
        isDragging: false,
        component: null,
        dragStartPosition: null,
        dragPosition:      null,
        dragOffset:        null
      };
      component.onDragEnd();
    }

    render() {
      const adaptedProps = adapter({
        onDragEnd:  this.onDragEnd,
        onDragMove: this.onDragMove
      });

      return (
        <Container {...this.props} {...adaptedProps} />
      );
    }
  }

  return DragContainer;
};

export default MakeDraggableContext;
