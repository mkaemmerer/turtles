// Primitive commands
//
// CommandPrim = Move (Number)
//             | Turn (Number)
//
const CommandPrim = (type, data) => ({type, data});
CommandPrim.Move  = (distance) => CommandPrim('Move', {distance});
CommandPrim.Turn  = (degrees)  => CommandPrim('Turn', {degrees});

CommandPrim.match = ({type, data}, handlers) => {
  switch(type) {
    case 'Move': return handlers.Move(data.distance);
    case 'Turn': return handlers.Turn(data.degrees);
  }
};


// Command expressions
//
// Command = Seq ([Command])
//         | Prim (CommandPrim)
//
const Command = (type, data) => ({type, data});
Command.Prim  = (command)  => Command('Prim', { command });
Command.Seq   = (commands) => Command('Seq',  { commands });

Command.match = ({type, data}, handlers) => {
  switch(type) {
    case 'Prim': return handlers.Prim(data.command);
    case 'Seq':  return handlers.Seq(data.commands);
  }
};

export {
  Command,
  CommandPrim
};
export default Command;
