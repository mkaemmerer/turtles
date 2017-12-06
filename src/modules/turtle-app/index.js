import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class TurtleApp extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    
    return (
      <div className={cx('turtle-app')}>
        {children}
      </div>
    );
  }
}

export default TurtleApp;
