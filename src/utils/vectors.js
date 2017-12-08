class Position2 {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  static origin = new Position2(0,0);

  static clone(p) {
    return new Position2(p.x, p.y);
  }
  static equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
  }
  static offset(p, v) {
    return new Position2(p.x + v.dx, p.y + v.dy);
  }
  static angleBetween(p1, p2, p3) {
    const v1 = Vector2.fromTo(p2, p1);
    const v2 = Vector2.fromTo(p2, p3);
    return Vector2.angleBetween(v1, v2);
  }

  clone()       { return Position2.clone(this);       }
  equals(p2)    { return Position2.equals(this, p2);  }
  offset(v)     { return Position2.offset(this, v);   }
  getOffset(p2) { return Vector2.fromTo(p2, this);    }
}

class Vector2 {
  constructor(dx,dy) {
    this.dx = dx;
    this.dy = dy;
  }
  static zero = new Vector2(0,0);
  static unitX = new Vector2(1,0);
  static unitY = new Vector2(0,1);

  static clone(v) {
    return new Vector2(v.dx, v.dy);
  }
  static equals(v1, v2) {
    return v1.dx === v2.dx && v1.dy === v2.dy;
  }
  static plus(v1,v2) {
    return new Vector2(v1.dx + v2.dx, v1.dy + v2.dy);
  }
  static times(v,s) {
    return new Vector2(s*v.dx, s*v.dy);
  }
  static dot(v1,v2) {
    return v1.dx*v2.dx + v1.dy*v2.dy;
  }
  static magnitude(v) {
    return Math.sqrt(Vector2.dot(v,v));
  }
  static unit(v) {
    const mag = Vector2.magnitude(v);
    return new Vector2(v.dx / mag, v.dy / mag);
  }
  static project(v1, v2) {
    const len = Vector2.dot(v1,v2) / Vector2.dot(v2,v2);
    return Vector2.times(len, v2);
  }
  static fromTo(p1, p2) {
    return new Vector2(p2.x - p1.x, p2.y - p1.y);
  }
  static rotate(v,r) {
    const cos = Math.cos(r);
    const sin = Math.sin(r);
    return new Vector2(v.dx*cos - v.dy*sin, v.dx*sin + v.dy*cos);
  }
  static fromRotation(r) {
    const cos = Math.cos(r);
    const sin = Math.sin(r);
    return new Vector2(cos, sin);
  }
  static angleBetween(v1, v2) {
    const dot = Vector2.dot(v1,v2);
    const det = v1.dx * v2.dy - v1.dy * v2.dx;
    return Math.atan2(det, dot);
  }
  static toRotation(v) {
    return Vector2.angleBetween(Vector2.unitX, v);
  }

  clone()     { return Vector2.clone(this);      }
  equals(v2)  { return Vector2.equals(this, v2); }
  plus(v2)    { return Vector2.plus(this, v2);   }
  times(s)    { return Vector2.times(this, s);   }
  dot(v2)     { return Vector2.dot(this, v2);    }
  magnitude() { return Vector2.magnitude(this);  }
  normalize() { return Vector2.unit(this);       }
  rotate(s)   { return Vector2.rotate(this, s);  }
  toRotation(){ return Vector2.toRotation(this); }
}


export {
  Vector2,
  Vector2 as V2,
  Position2,
  Position2 as P2
}
