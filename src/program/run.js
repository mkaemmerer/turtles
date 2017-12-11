import { last } from 'utils/generators';
import { V2 } from 'utils/vectors';
import { indexLens } from 'utils/lenses';
import { CommandPrim } from './command';
import Mark from './mark';
import Trace from './trace';

const DEGREES_TO_RADIANS = Math.PI / 180;

const step = (placement, command) =>
  CommandPrim.match(command, {
    Move(distance) {
      const newPlacement = placement.move(distance);
      const newMarks = [
        Mark.Line({
          from: placement.position,
          to:   newPlacement.position
        })
      ];
      return [ newPlacement, newMarks ];
    },
    Turn(degrees)  {
      const newPlacement = placement.rotate(degrees * DEGREES_TO_RADIANS);
      const newMarks = [
        Mark.Turn({
          position: placement.position,
          from:     V2.toRotation(placement.heading),
          to:       V2.toRotation(newPlacement.heading)
        })
      ];
      return [ newPlacement, newMarks ];
    }
  });

const stepTrace = ({placement, marks, trace}, programLine) => {
  const [ newPlacement, newMarks ] = step(placement, programLine.command);
  placement = newPlacement;

  for(const mark of newMarks) {
    const markLens = indexLens(marks.length);
    const outputEntry = { mark, lens: markLens };

    marks = marks.concat(mark);
    trace = trace.register(programLine, outputEntry);
  }

  return { placement, marks, trace };
};

const run = (placement, program) => {
  const initialState = {
    placement,
    marks: [],
    trace: Trace()
  };
  return last(program.interpret(initialState, stepTrace));
};

export default run;
