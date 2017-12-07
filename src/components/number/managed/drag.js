import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggable } from '../../generic/draggable';


const ManageState = (Number) => {
  const spec = {
    onDragStart(props) {
      props.onDragStart();
    },
    onDrag(props, monitor) {
      const offset = monitor.getDragOffset();
      props.onDrag(offset);
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
    onDrag = (offset) => {
      this.props.onChange(this.value + offset.x);
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
