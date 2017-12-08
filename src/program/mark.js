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

const Line = ({from, to}) => new Mark('line', {from, to});

export { Line };
