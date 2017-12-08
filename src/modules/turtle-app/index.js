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

    this.initialPlacement = new Placement(
      new P2(100, 100),
      V2.fromRotation(Math.PI/6)
    );
    const program = makeProgram();
    const { placement, output, trace } = run(this.initialPlacement, program);

    this.state = {
      program,
      placement,
      output,
      trace,
      highlightedMarks: [],
      highlightedCommands: []
    }
  }

  addCommand(command) {
    const { program } = this.state;
    const newProgram = program.append(command)[1];
    this.runProgram(newProgram);
  }
  runProgram(program) {
    const { placement, output, trace } = run(this.initialPlacement, program);
    this.setState({ program, placement, output, trace });
  }

  onProgramChange = (program) => {
    this.runProgram(program);
  }
  onTurtleMove = (movement) => {
    this.addCommand(Move(movement));
  }
  onTurtleRotate = (rotation) => {
    const degrees = +(rotation * RADIANS_TO_DEGREES).toFixed();
    this.addCommand(Turn(degrees));
  }

  onHoveredMarkChange = (entry) => {
    if(entry) {
      const { trace } = this.state;
      const source    = trace.getSource(entry);

      this.setState({
        highlightedMarks:    entry.lens.set([], true),
        highlightedCommands: source.lens.set([], true)
      });
    } else {
      this.setState({
        highlightedMarks: [],
        highlightedCommands: []
      });
    }
  }

  render() {
    const {
      program,
      placement,
      output,
      highlightedMarks,
      highlightedCommands
    } = this.state;

    return (
      <div className={cx('turtle-app')} {...this.props}>
        <svg className={cx('turtle-app_canvas')}>
          <Drawing
            output={output}
            onHoverChange={this.onHoveredMarkChange}
            highlightedMarks={highlightedMarks}
          />
          <Turtle
            placement={placement}
            onTurtleMove={this.onTurtleMove}
            onTurtleRotate={this.onTurtleRotate}
          />
        </svg>
        <div className={cx('turtle-app_sidebar')}>
          <Program
            program={program}
            onProgramChange={this.onProgramChange}
            highlightedCommands={highlightedCommands}
          />
        </div>
      </div>
    );
  }
}

export default MakeDraggableContext()(TurtleApp);
