import { V2, P2 } from 'utils/vectors';

class Placement {
  constructor(position, heading) {
    this.position = position;
    this.heading = heading;
  }
  static defaultPlacement = new Placement(new P2(100, 100), V2.unitX);

  rotate(r) {
    return new Placement(this.position, V2.rotate(this.heading, r));
  }
  move(d) {
    const direction = V2.times(this.heading, d);
    const newPosition = P2.offset(this.position, direction);
    return new Placement(newPosition, this.heading);
  }
  moveDir(v) {
    const amount = V2.dot(this.heading, v);
    return this.move(amount);
  }
}

export default Placement;
