class Mark {
  constructor(data) {
    this.data = data;
  }
  static Line({from, to}){
    return new LineMark({from, to});
  }
  static Turn({position, from, to}) {
    return new TurnMark({position, from, to});
  }
}
class LineMark extends Mark {
  match(handlers) {
    return handlers['Line'](this.data);
  }
}
class TurnMark extends Mark {
  match(handlers) {
    return handlers['Turn'](this.data);
  }
}


export default Mark;
