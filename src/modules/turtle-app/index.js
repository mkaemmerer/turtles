import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggableContext } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Placement from 'utils/placement';
import Turtle from '../turtle';
import run from './run';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const toPathString = (path) =>
  'M' + path.map((p) => `${p.position.x}, ${p.position.y}`).join(' L ');

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
    const initialPlacement = new Placement(
      new P2(100, 100),
      V2.fromRotation(Math.PI/6)
    );
    const placements = run(initialPlacement, commands);
    const pathString = toPathString(placements);

    return (
      <div className={cx('turtle-app')} {...this.props}>
        <svg className={cx('turtle-app_canvas')}>
          <Turtle
            onTurtleMove={this.onTurtleMove}
            onTurtleRotate={this.onTurtleRotate}
          />
          <path className={cx('turtle-app_drawing')} d={pathString}/>
        </svg>
      </div>
    );
  }
}

export default MakeDraggableContext()(TurtleApp);
