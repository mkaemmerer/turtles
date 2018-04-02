import React from 'react';
import PropTypes from 'prop-types';

const defaultDragState = {
  isDragging: false,
  component:  null,
  dragStartPosition: null,
  dragPosition:      null,
  dragOffset:        null,
  ctrlKey:  false,
  shiftKey: false,
  metaKey:  false
};

//By default, map to mouseUp and mouseMove
const defaultAdapter = ({ onDragMove, onDragEnd, onModifierKeyChanged }) => ({
  onMouseMove: onDragMove,
  onMouseUp:   onDragEnd,
  onKeyDown:   onModifierKeyChanged,
  onKeyUp:     onModifierKeyChanged
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
      this.dragState = defaultDragState;
    }

    makeDragMonitor = (component) => {
      const getState = () =>
        (component === this.dragState.component)
          ? this.dragState
          : defaultDragState;

      return {
        isDragging:           () => getState().isDragging,
        getDragStartPosition: () => getState().dragStartPosition,
        getDragPosition:      () => getState().dragPosition,
        getDragOffset:        () => getState().dragOffset,
        ctrlKey:              () => getState().ctrlKey,
        shiftKey:             () => getState().shiftKey,
        metaKey:              () => getState().metaKey,
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
        ctrlKey:  false,
        shiftKey: false,
        metaKey:  false
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

      this.dragState = {
        isDragging: true,
        component,
        dragStartPosition,
        dragPosition,
        dragOffset,
        ctrlKey:  e.ctrlKey,
        shiftKey: e.shiftKey,
        metaKey:  e.metaKey
      };

      component.onDrag();
    }
    onDragEnd = () => {
      if(!this.dragState.isDragging) { return; }

      const { component } = this.dragState;
      this.dragState = defaultDragState;
      component.onDragEnd();
    }
    onModifierKeyChanged = (e) => {
      if(!this.dragState.isDragging) { return; }

      if(e.ctrlKey !== this.dragState.ctrlKey ||
        e.shiftKey !== this.dragState.shiftKey ||
        e.metaKey !== this.dragState.metaKey
      ) {
        this.dragState.ctrlKey  = e.ctrlKey;
        this.dragState.shiftKey = e.shiftKey;
        this.dragState.metaKey  = e.metaKey;
        this.dragState.component.onDrag();
      }
    }

    render() {
      const adaptedProps = adapter({
        onDragEnd:  this.onDragEnd,
        onDragMove: this.onDragMove,
        onModifierKeyChanged: this.onModifierKeyChanged
      });

      return (
        <Container {...this.props} {...adaptedProps} />
      );
    }
  }

  return DragContainer;
};

export default MakeDraggableContext;
