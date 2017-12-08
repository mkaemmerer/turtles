const DEGREES_TO_RADIANS = Math.PI / 180;

const step = (placement, line) =>
  line.command.match({
    move({distance}) {
      const newPlacement = placement.move(distance);
      const output = { from: placement.position, to: newPlacement.position };
      return [newPlacement, [output]];
    },
    turn({degrees})  {
      const newPlacement = placement.rotate(degrees * DEGREES_TO_RADIANS);
      return [newPlacement, []];
    }
  });

const interpret = (state, step, program) => {
  let results = [];

  for(const line of program.lines) {
    const [newState, newResults] = step(state, line);
    results = results.concat(newResults);
    state   = newState;
  }

  return [state, results];
};

const run = (placement, program) => interpret(placement, step, program);
export default run;
