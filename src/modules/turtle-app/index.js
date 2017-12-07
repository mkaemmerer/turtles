import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggableContext } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Placement from 'utils/placement';
import Turtle from '../turtle';
import Drawing from '../drawing';
import run from './run';

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
    this.initialPlacement = new Placement(
      new P2(100, 100),
      V2.fromRotation(Math.PI/6)
    );
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
    const placements = run(this.initialPlacement, commands);
    const currentPlacement = placements[placements.length-1];

    return (
      <div className={cx('turtle-app')} {...this.props}>
        <svg className={cx('turtle-app_canvas')}>
          <Drawing
            placements={placements}
          />
          <Turtle
            placement={currentPlacement}
            onTurtleMove={this.onTurtleMove}
            onTurtleRotate={this.onTurtleRotate}
          />
        </svg>
      </div>
    );
  }
}

export default MakeDraggableContext()(TurtleApp);
