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
      move: id,
      turn: id
    }),
    set: (c,amount) => c.match({
      move: () => Command.Move(amount),
      turn: () => Command.Turn(amount)
    })
  }
}
class MoveCommand extends Command {
  match(handlers) {
    return handlers['move'](this.data.distance);
  }
}
class TurnCommand extends Command {
  match(handlers) {
    return handlers['turn'](this.data.degrees);
  }
}


export default Command;
