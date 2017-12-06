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
      dragState:  PropTypes.object,
      startDrag:  PropTypes.func
    }

    render() {
      const adaptedProps = adapter({
        ...this.context.dragState,
        onDragStart: this.context.startDrag
      });

      return (
        <Component {...this.props} {...adaptedProps} />
      );
    }
  }

  return Draggable;
};

export default MakeDraggable;
