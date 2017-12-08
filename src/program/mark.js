class Mark {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
  match(handlers) {
    const handle = handlers[this.type];
    return handle(this.data);
  }
}

const Line = ({from, to})           => new Mark('line', {from, to});
const Turn = ({position, from, to}) => new Mark('turn', {position, from, to});

export { Line, Turn };
