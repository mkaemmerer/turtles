const DEGREES_TO_RADIANS = Math.PI / 180;

const scan = (arr, seed, step) => {
  const ret = [];
  ret.push(seed);
  for(const x of arr) {
    seed = step(seed, x);
    ret.push(seed);
  }
  return ret;
};

const step = (placement, command) => {
  switch(command.type){
    case 'move': return placement.move(command.amount);
    case 'turn': return placement.rotate(command.amount * DEGREES_TO_RADIANS);
  }
}

const run = (placement, commands) => {
  return scan(commands, placement, step);
};

export default run;
