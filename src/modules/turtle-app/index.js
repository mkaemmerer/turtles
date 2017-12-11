import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggableContext } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Placement from 'utils/placement';
import { emptyLens } from 'utils/lenses';
import makeProgram from 'program/program';
import { Turn, Move } from 'program/command';
import run from 'program/run';
import Turtle from '../turtle';
import Drawing from '../drawing';
import Program from '../program';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const RADIANS_TO_DEGREES = 180 / Math.PI;
const initialPlacement = new Placement(
  P2(480, 380),
  V2(0, -1)
);

class TurtleApp extends React.Component {
  static propTypes = {
    onMouseUp:   PropTypes.func,
    onMouseMove: PropTypes.func
  }
  constructor(props) {
    super(props);

    this.initialPlacement = initialPlacement;
    this.program = makeProgram();
    this.currentCommand = emptyLens;

    const { placement, output, trace } = run(this.initialPlacement, this.program);
    this.state = {
      program: this.program,
      placement,
      output,
      trace,
      highlightedMarks: [],
      highlightedCommands: []
    }
  }

  addCommand(command) {
    const { program } = this.state;
    const [newCommand, newProgram] = program.append(command);
    this.currentCommand = newCommand.lens;
    this.runProgram(newProgram);
  }
  runProgram(program) {
    this.program = program;
    const { placement, output, trace } = run(this.initialPlacement, program);
    this.setState({ program, placement, output, trace });
  }

  onProgramChange = (program) => {
    this.runProgram(program);
  }
  onTurtleMoveStart = () => {
    this.addCommand(Move(0));
  }
  onTurtleMove = (movement) => {
    const newProgram = this.program.set(this.currentCommand, Move(movement));
    this.runProgram(newProgram);
  }
  onTurtleMoveEnd = () => {
    this.currentCommand = emptyLens;
  }
  onTurtleRotateStart = () => {
    this.addCommand(Turn(0));
  }
  onTurtleRotate = (rotation) => {
    const degrees = +(rotation * RADIANS_TO_DEGREES).toFixed();
    const newProgram = this.program.set(this.currentCommand, Turn(degrees));
    this.runProgram(newProgram);
  }
  onTurtleRotateEnd = () => {
    this.currentCommand = emptyLens;
  }

  onHoveredMarkChange = (outputEntry) => {
    if(outputEntry) {
      const { trace }  = this.state;
      const sourceLine = trace.getSource(outputEntry);

      this.setState({
        highlightedMarks:    outputEntry.lens.set([], true),
        highlightedCommands: sourceLine.lens.set([], true)
      });
    } else {
      this.setState({
        highlightedMarks: [],
        highlightedCommands: []
      });
    }
  }
  onHoveredCommandChange = (sourceLine) => {
    if(sourceLine) {
      const { trace }   = this.state;
      const outputEntry = trace.getOutput(sourceLine);

      this.setState({
        highlightedMarks:    outputEntry.lens.set([], true),
        highlightedCommands: sourceLine.lens.set([], true)
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
            onTurtleMoveStart = {this.onTurtleMoveStart}
            onTurtleMove      = {this.onTurtleMove}
            onTurtleMoveEnd   = {this.onTurtleMoveEnd}
            onTurtleRotateStart = {this.onTurtleRotateStart}
            onTurtleRotate      = {this.onTurtleRotate}
            onTurtleRotateEnd   = {this.onTurtleRotateEnd}
          />
        </svg>
        <div className={cx('turtle-app_sidebar')}>
          <Program
            program={program}
            onProgramChange={this.onProgramChange}
            onHoverChange={this.onHoveredCommandChange}
            highlightedCommands={highlightedCommands}
          />
        </div>
      </div>
    );
  }
}

export default MakeDraggableContext()(TurtleApp);
