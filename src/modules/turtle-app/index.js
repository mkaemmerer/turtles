import React from 'react';
import PropTypes from 'prop-types';
import { MakeDraggableContext } from 'components/generic/draggable';
import { P2, V2 } from 'utils/vectors';
import Placement from 'utils/placement';
import { emptyLens, indexLens, propertyLens, composeLens } from 'utils/lenses';
import run from 'program/run';
import * as AST from 'lang/ast';
import Canvas from '../canvas';
import Program from '../program';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const RADIANS_TO_DEGREES = 180 / Math.PI;
const initialPlacement = new Placement(
  P2.origin,
  V2(0, -1)
);

const MoveConst = (value) =>
  AST.Expr.Cmd({
    cmd: AST.Cmd.Move({
      expr: AST.Expr.Const({ value })
    })
  });
const TurnConst = (value) =>
  AST.Expr.Cmd({
    cmd: AST.Cmd.Turn({
      expr: AST.Expr.Const({ value })
    })
  });

@MakeDraggableContext()
class TurtleApp extends React.Component {
  static propTypes = {
    initialProgram: PropTypes.object,
    onMouseUp:   PropTypes.func,
    onMouseMove: PropTypes.func,
    onKeyDown:   PropTypes.func,
    onKeyUp:     PropTypes.func,
  }
  constructor(props) {
    super(props);

    this.program = props.initialProgram;
    this.initialPlacement = initialPlacement;
    this.currentLens = emptyLens;

    const { placement, marks, trace } = run(this.initialPlacement, this.program);
    this.state = {
      program: this.program,
      placement,
      marks,
      trace,
      highlightedMarks: [],
      highlightedCommands: {}
    }
  }

  addCommand(command) {
    const newProgram = AST.Cmd.Block({
      binds: this.program.binds,
      cmds:  this.program.cmds.concat(command)
    });
    this.runProgram(newProgram);
  }
  runProgram(program) {
    this.program = program;
    const { placement, marks, trace } = run(this.initialPlacement, program);
    this.setState({ program, placement, marks, trace });
  }

  onProgramChange = (program) => {
    this.runProgram(program);
  }
  onTurtleMoveStart = () => {
    this.addCommand(MoveConst(0));
    this.currentLens = composeLens(
      propertyLens('cmds'),
      indexLens(this.program.cmds.length - 1)
    );
  }
  onTurtleMove = (movement) => {
    const newProgram = this.currentLens.set(this.program, MoveConst(movement));
    this.runProgram(newProgram);
  }
  onTurtleMoveEnd = () => {
    this.currentLens = emptyLens;
  }
  onTurtleRotateStart = () => {
    this.addCommand(TurnConst(0));
    this.currentLens = composeLens(
      propertyLens('cmds'),
      indexLens(this.program.cmds.length - 1)
    );
  }
  onTurtleRotate = (rotation) => {
    const degrees = +(rotation * RADIANS_TO_DEGREES).toFixed();
    const newProgram = this.currentLens.set(this.program, TurnConst(degrees));
    this.runProgram(newProgram);
  }
  onTurtleRotateEnd = () => {
    this.currentLens = emptyLens;
  }

  onHoveredMarkChange = (outputLens) => {
    if(outputLens) {
      const { trace }  = this.state;
      const sourceLens = trace.getSource(outputLens);

      this.setState({
        highlightedMarks:    outputLens.set([], true),
        highlightedCommands: sourceLens.set({}, true)
      });
    } else {
      this.setState({
        highlightedMarks: [],
        highlightedCommands: {}
      });
    }
  }
  onHoveredCommandChange = (sourceLens) => {
    if(sourceLens) {
      const { trace }  = this.state;
      const highlightedCommands = sourceLens.set({}, true);
      const highlightedMarks    = trace
        .getOutput(sourceLens)
        .reduce((list, lens) =>
          lens.set(list,true),
        []);

      this.setState({
        highlightedMarks,
        highlightedCommands
      });
    } else {
      this.setState({
        highlightedMarks: [],
        highlightedCommands: {}
      });
    }
  }

  render() {
    const {
      program,
      placement,
      marks,
      highlightedMarks,
      highlightedCommands
    } = this.state;

    const { initialProgram, ...props } = this.props;

    return (
      <div className={cx('turtle-app')} tabIndex="0" {...props}>
        <Canvas
          placement={placement}
          marks={marks}
          highlightedMarks={highlightedMarks}
          onHoveredMarkChange = {this.onHoveredMarkChange}
          onTurtleMoveStart   = {this.onTurtleMoveStart}
          onTurtleMove        = {this.onTurtleMove}
          onTurtleMoveEnd     = {this.onTurtleMoveEnd}
          onTurtleRotateStart = {this.onTurtleRotateStart}
          onTurtleRotate      = {this.onTurtleRotate}
          onTurtleRotateEnd   = {this.onTurtleRotateEnd}
        />
        <div className={cx('turtle-app_sidebar')}>
          <Program
            program={program}
            highlightedCommands={highlightedCommands}
            onProgramChange = {this.onProgramChange}
            onHoverChange   = {this.onHoveredCommandChange}
          />
        </div>
      </div>
    );
  }
}

export default TurtleApp;
