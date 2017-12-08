class Command {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
  match(handlers) {
    const handle = handlers[this.type];
    return handle(this.data);
  }
  set(lens, value) {
    const data = lens.set(this.data, value);
    return new Command(this.type, data);
  }
}


const Turn = (degrees)  => new Command('turn', {degrees});
const Move = (distance) => new Command('move', {distance});

export { Turn, Move };
