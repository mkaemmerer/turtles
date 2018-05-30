import { V2 } from 'utils/vectors';
import { indexLens } from 'utils/lenses';
import { reduce } from 'utils/generators';
import evaluate from 'lang/evaluate';
import Mark from './mark';
import Trace from './trace';

const match = (node, handlers) => handlers[node.type](node);
const DEGREES_TO_RADIANS = Math.PI / 180;


const step = (placement, prim) =>
  match(prim, {
    'Effect.Move': ({distance}) => {
      const newPlacement = placement.move(distance);
      const newMarks = [
        Mark.Line({
          from: placement.position,
          to:   newPlacement.position
        })
      ];
      return [ newPlacement, newMarks ];
    },
    'Effect.Turn': ({degrees}) => {
      const newPlacement = placement.rotate(degrees * DEGREES_TO_RADIANS);
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
