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
    case 'turn': return placement.rotate(command.amount);
  }
}

const run = (placement, commands) => {
  return scan(commands, placement, step);
};

export default run;
