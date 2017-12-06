import React from 'react';
import { Turtle } from '../shapes';
import Controls from '../controls';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class TurtleApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={cx('turtle-app')}>
        <svg className={cx('turtle-app_canvas')}>
          <g transform="translate(100, 100)">
            <Turtle/>
            <Controls/>
          </g>
        </svg>
      </div>
    );
  }
}

export default TurtleApp;
