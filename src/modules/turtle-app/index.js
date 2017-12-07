import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggableContext } from 'components/generic/draggable';
import Turtle from '../turtle';
import Drawing from '../drawing';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class TurtleApp extends React.Component {
  static propTypes = {
    onMouseUp:   PropTypes.func,
    onMouseMove: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      commands: []
    };
  }

  addCommand(command) {
    const { commands } = this.state;
    const newCommands = commands.concat(command);
    this.setState({ commands: newCommands });
  }

  onTurtleMove = (movement) => {
    this.addCommand({ type: 'move', amount: movement });
  }
  onTurtleRotate = (rotation) => {
    this.addCommand({ type: 'rotate', amount: rotation });
  }

  render() {
    const { commands } = this.state;

    return (
      <div className={cx('turtle-app')} {...this.props}>
        <svg className={cx('turtle-app_canvas')}>
          <Drawing commands={commands}/>
          <Turtle
            onTurtleMove={this.onTurtleMove}
            onTurtleRotate={this.onTurtleRotate}
          />
        </svg>
      </div>
    );
  }
}

export default MakeDraggableContext()(TurtleApp);
