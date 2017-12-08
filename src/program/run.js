import { last } from 'utils/generators';
import { Line } from './mark';
import Output from './output';
import Trace from './trace';

const DEGREES_TO_RADIANS = Math.PI / 180;

const step = ({placement, output, trace}, programLine) =>
  programLine.command.match({
    move({distance}) {
      const newPlacement = placement.move(distance);
      const [newOutputEntry, newOutput] = output.append(Line({
        from: placement.position,
        to:   newPlacement.position
      }));
      const newTrace = trace.register(programLine, newOutputEntry);

      return {
        placement: newPlacement,
        output: newOutput,
        trace: newTrace
      };
    },
    turn({degrees})  {
      const newPlacement = placement.rotate(degrees * DEGREES_TO_RADIANS);
      return {
        placement: newPlacement,
        output,
        trace
      };
    }
  });

const run = (placement, program) => {
  const initialState = {
    placement,
    output: Output(),
    trace:  Trace()
  };
  return last(program.interpret(initialState, step));
};

export default run;
