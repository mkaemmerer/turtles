const id = (x) => x;

const Command = (type, data) => ({type, data});
Command.Move  = (distance) => Command('Move', {distance});
Command.Turn  = (degrees)  => Command('Turn', {degrees});

Command.match = ({type, data}, handlers) => {
  switch(type) {
    case 'Move': return handlers.Move(data.distance);
    case 'Turn': return handlers.Turn(data.degrees);
  }
};

Command.lens  = {
  get: (c) => Command.match(c, {
    Move: id,
    Turn: id
  }),
  set: (c,amount) => Command.match(c, {
    Move: () => Command.Move(amount),
    Turn: () => Command.Turn(amount)
  })
};

export default Command;
