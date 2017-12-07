import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggableContext } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Placement from 'utils/placement';
import { propertyLens, composeLens } from 'utils/lenses';
import Turtle from '../turtle';
import Drawing from '../drawing';
import Program from '../program';
import run from './run';

const commandsLens = propertyLens('commands');
const RADIANS_TO_DEGREES = 180 / Math.PI;

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

  onCommandChange = (commandLens, newCommand) => {
    const lens = composeLens(commandsLens, commandLens);
    this.setState((state) => lens.set(state, newCommand));
  }
  onTurtleMove = (movement) => {
    this.addCommand({ type: 'move', amount: movement });
  }
  onTurtleRotate = (rotation) => {
    this.addCommand({ type: 'turn', amount: rotation * RADIANS_TO_DEGREES });
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
        <div className={cx('turtle-app_sidebar')}>
          <Program
            commands={commands}
            onCommandChange={this.onCommandChange}
          />
        </div>
      </div>
    );
  }
}

export default MakeDraggableContext()(TurtleApp);
