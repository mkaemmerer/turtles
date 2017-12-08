import { last } from 'utils/generators';
import { Line } from './output';

const DEGREES_TO_RADIANS = Math.PI / 180;

const step = (placement, programLine) =>
  programLine.command.match({
    move({distance}) {
      const newPlacement = placement.move(distance);
      const output = Line({
        from: placement.position,
        to:   newPlacement.position
      }, programLine.lens);
      return [newPlacement, [output]];
    },
    turn({degrees})  {
      const newPlacement = placement.rotate(degrees * DEGREES_TO_RADIANS);
      return [newPlacement, []];
    }
  });

const run = (placement, program) => last(program.interpret(placement, step));
export default run;
