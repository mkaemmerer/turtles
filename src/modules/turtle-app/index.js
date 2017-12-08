import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggableContext } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Placement from 'utils/placement';
import makeProgram from 'program/program';
import { Turn, Move } from 'program/command';
import run from 'program/run';

import Turtle from '../turtle';
import Drawing from '../drawing';
import Program from '../program';

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
      program: makeProgram()
    };
    this.initialPlacement = new Placement(
      new P2(100, 100),
      V2.fromRotation(Math.PI/6)
    );
  }

  addCommand(command) {
    const { program } = this.state;
    const newProgram = program.append(command);
    this.setState({ program: newProgram });
  }

  onProgramChange = (program) => {
    this.setState({ program });
  }
  onTurtleMove = (movement) => {
    this.addCommand(Move(movement));
  }
  onTurtleRotate = (rotation) => {
    const degrees = +(rotation * RADIANS_TO_DEGREES).toFixed();
    this.addCommand(Turn(degrees));
  }

  render() {
    const { program } = this.state;
    const placements = run(this.initialPlacement, program);
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
            program={program}
            onProgramChange={this.onProgramChange}
          />
        </div>
      </div>
    );
  }
}

export default MakeDraggableContext()(TurtleApp);
