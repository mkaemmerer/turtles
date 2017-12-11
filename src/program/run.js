import { last } from 'utils/generators';
import { V2 } from 'utils/vectors';
import { indexLens } from 'utils/lenses';
import { Line, Turn } from './mark';
import Trace from './trace';

const DEGREES_TO_RADIANS = Math.PI / 180;

const step = (placement, programLine) =>
  programLine.command.match({
    move(distance) {
      const newPlacement = placement.move(distance);
      const newMarks = [
        Line({
          from: placement.position,
          to:   newPlacement.position
        })
      ];
      return [ newPlacement, newMarks ];
    },
    turn(degrees)  {
      const newPlacement = placement.rotate(degrees * DEGREES_TO_RADIANS);
      const newMarks = [
        Turn({
          position: placement.position,
          from:     V2.toRotation(placement.heading),
          to:       V2.toRotation(newPlacement.heading)
        })
      ];
      return [ newPlacement, newMarks ];
    }
  });

const stepTrace = ({placement, marks, trace}, programLine) => {
  const [ newPlacement, newMarks ] = step(placement, programLine);
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
