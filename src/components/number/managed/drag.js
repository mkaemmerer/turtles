import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggable } from '../../generic/draggable';


const ManageState = (Number) => {
  const spec = {
    onDragStart(props) {
      props.onDragStart();
    },
    onDrag(props, monitor) {
      const offset   = monitor.getDragOffset();
      const ctrlKey  = monitor.ctrlKey();
      const shiftKey = monitor.shiftKey();
      props.onDrag(offset.x, ctrlKey, shiftKey);
    },
    onDragEnd(props) {
      props.onDragEnd();
    }
  };
  const adapter = (monitor) => ({
    onMouseDown: monitor.onDragStart
  });
  const DraggableNumber = MakeDraggable(spec, adapter)(Number);

  class ManagedNumber extends React.Component {
    static propTypes = {
      value:    PropTypes.number,
      onChange: PropTypes.func
    }

    onDragStart = () => {
      this.value = this.props.value;
    }
    onDrag = (offset, ctrlKey, shiftKey) => {
      const delta = shiftKey
        ? Math.floor(offset/10)
        : offset;

      const value = (ctrlKey && !shiftKey)
        ? Math.round((this.value + delta) / 10) * 10
        : this.value + delta;

      this.props.onChange(value);
    }
    onDragEnd = () => {
    }

    render() {
      const { onChange, ...props } = this.props;

      return (
        <DraggableNumber
          {...props}
          onDragStart={this.onDragStart}
          onDrag={this.onDrag}
          onDragEnd={this.onDragEnd}
        />
      );
    }
  }

  return ManagedNumber;
};

export default ManageState;
