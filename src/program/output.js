class Output {
  constructor(type, data, lens) {
    this.type = type;
    this.data = data;
    this.lens = lens;
  }
  match(handlers) {
    const handle = handlers[this.type];
    return handle(this.data, this.lens);
  }
}


const Line = ({from, to}, lens)  => new Output('line', {from, to}, lens);

export { Line };
