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
  const adapter = (props, monitor) => ({
    onMouseDown: monitor.onDragStart
  });
  const DraggableNumber = MakeDraggable(spec, adapter)(Number);

  class ManagedNumber extends React.Component {
    static propTypes = {
      value:       PropTypes.number,
      increment:   PropTypes.number,
      scaleFactor: PropTypes.number,
      onChange:    PropTypes.func.isRequired,
      onDragStart: PropTypes.func,
      onDragEnd:   PropTypes.func
    }
    static defaultProps = {
      increment: 10,
      scaleFactor: 0.1,
      onDragStart: () => {},
      onDragEnd:   () => {}
    }

    onDragStart = () => {
      this.value = this.props.value;
      this.props.onDragStart();
    }
    onDrag = (offset, ctrlKey, shiftKey) => {
      const { increment, scaleFactor } = this.props;

      const delta = shiftKey
        ? Math.floor(offset * scaleFactor)
        : offset;

      const value = (ctrlKey && !shiftKey)
        ? Math.round((this.value + delta) / increment) * increment
        : this.value + delta;

      this.props.onChange(value);
    }
    onDragEnd = () => {
      this.props.onDragEnd();
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
