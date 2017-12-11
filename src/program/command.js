const id = (x) => x;

// Primitive commands. Move and Turn
const CommandPrim = (type, data) => ({type, data});
CommandPrim.Move  = (distance) => CommandPrim('Move', {distance});
CommandPrim.Turn  = (degrees)  => CommandPrim('Turn', {degrees});

CommandPrim.match = ({type, data}, handlers) => {
  switch(type) {
    case 'Move': return handlers.Move(data.distance);
    case 'Turn': return handlers.Turn(data.degrees);
  }
};
CommandPrim.lens  = {
  get: (c) => CommandPrim.match(c, {
    Move: id,
    Turn: id
  }),
  set: (c,amount) => CommandPrim.match(c, {
    Move: () => CommandPrim.Move(amount),
    Turn: () => CommandPrim.Turn(amount)
  }),
  name: 'CommandPrim'
};


// Command expressions
const Command = (type, data) => ({type, data});
Command.Prim  = (command)  => Command('Prim', { command });
Command.Seq   = (commands) => Command('Seq',  { commands });

Command.match = ({type, data}, handlers) => {
  switch(type) {
    case 'Prim': return handlers.Prim(data.command);
    case 'Seq':  return handlers.Seq(data.commands);
  }
};
Command.lens  = {
  get: (c) => Command.match(c, {
    Prim: id,
    Seq:  id
  }),
  set: (c,data) => Command.match(c, {
    Prim: () => Command.Prim(data),
    Seq:  () => Command.Seq(data)
  }),
  name: 'Command'
};

export {
  Command,
  CommandPrim
};
export default Command;
