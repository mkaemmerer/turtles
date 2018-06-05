import { V2 } from 'utils/vectors';
import { indexLens } from 'utils/lenses';
import { reduce } from 'utils/generators';
import evaluate from 'lang/evaluate';
import match from 'lang/match';
import Mark from './mark';
import Trace from './trace';

const DEGREES_TO_RADIANS = Math.PI / 180;

const moveSign = (direction) => {
  switch(direction) {
    case 'forward':  return 1;
    case 'backward': return -1;
  }
};
const turnSign = (direction) => {
  switch(direction) {
    case 'left':  return -1;
    case 'right': return 1;
  }
};

const step = (placement, prim) =>
  match(prim, {
    'Effect.Move': ({distance, direction}) => {
      const newPlacement = placement.move(distance * moveSign(direction));
      const newMarks = [
        Mark.Line({
          from: placement.position,
          to:   newPlacement.position
        })
      ];
      return [ newPlacement, newMarks ];
    },
    'Effect.Turn': ({degrees, direction}) => {
      const newPlacement = placement.rotate(degrees * DEGREES_TO_RADIANS * turnSign(direction));
      const newMarks = [
        Mark.Turn({
          position: placement.position,
          degrees,
          from:     V2.toRotation(placement.heading),
          to:       V2.toRotation(newPlacement.heading)
        })
      ];
      return [ newPlacement, newMarks ];
    }
  });

const run = (placement, program) => {
  const initialState = { placement, marks: [] };

  const runStep = ({effect}, {placement, marks}) => {
    const [ newPlacement, newMarks ] = step(placement, effect);
    return { placement: newPlacement, marks: marks.concat(newMarks) };
  };

  return reduce(runStep, initialState, evaluate(program));
};

const runTrace = (placement, program) => {
  const initialState = { placement, marks: [], trace: Trace() };

  const runStep = ({effect, location}, {placement, marks, trace}) => {
    const [ newPlacement, newMarks ] = step(placement, effect);
    placement = newPlacement;
    for(const mark of newMarks) {
      const markLens = indexLens(marks.length);
      marks = marks.concat(mark);
      trace = trace.register(location, markLens);
    }
    return { placement, marks, trace };
  };

  return reduce(runStep, initialState, evaluate(program));
};

export {
  run,
  runTrace
};
