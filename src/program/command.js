const id = (x) => x;

class Command {
  constructor(data) {
    this.data = data;
  }
  static Turn(degrees) {
    return new TurnCommand({degrees});
  }
  static Move(distance){
    return new MoveCommand({distance});
  }
  static lens = {
    get: (c) => c.match({
      Move: id,
      Turn: id
    }),
    set: (c,amount) => c.match({
      Move: () => Command.Move(amount),
      Turn: () => Command.Turn(amount)
    })
  }
}
class MoveCommand extends Command {
  match(handlers) {
    return handlers['Move'](this.data.distance);
  }
}
class TurnCommand extends Command {
  match(handlers) {
    return handlers['Turn'](this.data.degrees);
  }
}


export default Command;
