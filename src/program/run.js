import { V2 } from 'utils/vectors';
import { indexLens } from 'utils/lenses';
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

const stepTrace = ({placement, marks, trace}, {effect, location}) => {
  const [ newPlacement, newMarks ] = step(placement, effect);
  placement = newPlacement;

  for(const mark of newMarks) {
    const markLens = indexLens(marks.length);

    marks = marks.concat(mark);
    trace = trace.register(location[0], markLens);
  }

  return { placement, marks, trace };
};

const run = (placement, program) => {
  const initialState = {
    placement,
    marks: [],
    trace: Trace()
  };

  let state = initialState;
  for(const out of evaluate(program)) {
    state = stepTrace(state, out);
  }

  return state;
};

export default run;
