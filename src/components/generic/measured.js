import React from 'react';
import PropTypes from 'prop-types';

class Measured extends React.PureComponent {
  static propTypes = {
    onResize: PropTypes.func,
    children: PropTypes.func.isRequired
  }
  static defaultProps = {
    onResize: () => {}
  }

  constructor() {
    super();
    this.resizeObserver = new ResizeObserver(this.onResize);
  }
  onResize = (entries) => {
    const dimensions = entries[0].contentRect;
    this.props.onResize(dimensions);
  }

  ref = (el) => {
    if(this.el) {
      this.resizeObserver.unobserve(this.el);
    }
    if(el){
      this.resizeObserver.observe(el);
    }
    this.el = el;
  }

  render() {
    const { children } = this.props;
    return children(this.ref);
  }
}

export default Measured;
