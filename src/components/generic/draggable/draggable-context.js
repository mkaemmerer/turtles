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
      this.id = 0;
      this.draggingId = null;
      this.state   = {
        isDragging: false,
        dragStartPosition: null,
        dragPosition:      null,
        dragOffset:        null
      };
    }

    makeDragMonitor = () => {
      const id = this.id++;
      const whenActive = (x, d) => () => {
        return (id === this.draggingId)
          ? x()
          : d;
      };

      return {
        isDragging:           whenActive(() => this.state.isDragging,        false),
        getDragOffset:        whenActive(() => this.state.dragOffset,        null),
        getDragStartPosition: whenActive(() => this.state.dragStartPosition, null),
        getDragPosition:      whenActive(() => this.state.dragPosition,      null),
        startDrag: (e) => { this.onDragStart(e, id); }
      };
    }

    onDragStart = (e, id) => {
      if(this.state.isDragging) { return; }
      this.draggingId = id;

      this.setState({
        isDragging: true,
        dragStartPosition: {x: e.screenX, y: e.screenY},
        dragPosition:      {x: e.screenX, y: e.screenY},
        dragOffset:        {x: 0, y: 0}
      });
    }
    onDragMove = (e) => {
      if(!this.state.isDragging) { return; }

      const { dragStartPosition } = this.state;
      const dragPosition = {
        x: e.screenX,
        y: e.screenY
      };
      const dragOffset = {
        x: dragPosition.x - dragStartPosition.x,
        y: dragPosition.y - dragStartPosition.y
      };

      this.setState({ dragOffset, dragPosition });
    }
    onDragEnd = () => {
      this.draggingId = null;
      this.setState({
        isDragging: false,
        dragStartPosition: null,
        dragPosition:      null,
        dragOffset:        null
      });
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
