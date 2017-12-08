import { fromIterable } from 'utils/generators/fluent';

const DEGREES_TO_RADIANS = Math.PI / 180;

const step = (placement, command) =>
  command.match({
    move({distance}) { return placement.move(distance); },
    turn({degrees})  { return placement.rotate(degrees * DEGREES_TO_RADIANS); }
  });

const run = (placement, commands) =>
  fromIterable(commands)
    .scan(step, placement)
    .toArray();

export default run;
