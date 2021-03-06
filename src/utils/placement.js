import { V2, P2 } from 'utils/vectors';

class Placement {
  constructor(position, heading) {
    this.position = position;
    this.heading = heading;
  }
  static defaultPlacement = new Placement(P2.origin, V2.unitX);

  rotate(r) {
    return new Placement(this.position, V2.rotate(this.heading, r));
  }
  move(d) {
    const direction = V2.times(this.heading, d);
    const newPosition = P2.offset(this.position, direction);
    return new Placement(newPosition, this.heading);
  }
}

export default Placement;
