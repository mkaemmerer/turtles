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
      dragState: PropTypes.object,
      startDrag: PropTypes.func
    }
    getChildContext() {
      return {
        dragState: this.state,
        startDrag: this.onDragStart
      };
    }

    constructor() {
      super();
      this.state   = {
        isDragging: false,
        dragStartPosition: null,
        dragPosition:      null,
        dragOffset:        null
      };
    }

    onDragStart = (e) => {
      if(this.state.isDragging) { return; }

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
