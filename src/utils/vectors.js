function Position2(x,y) {
  return {x,y};
}
Position2.origin = Position2(0,0);

Position2.equals = (p1, p2) => {
  return p1.x === p2.x && p1.y === p2.y;
};
Position2.offset = (p, v) => {
  return Position2(p.x + v.dx, p.y + v.dy);
};
Position2.angleBetween = (p1, p2, p3) => {
  const v1 = Vector2.fromTo(p2, p1);
  const v2 = Vector2.fromTo(p2, p3);
  return Vector2.angleBetween(v1, v2);
};


function Vector2(dx,dy) {
  return {dx,dy};
}
Vector2.zero = Vector2(0,0);
Vector2.unitX = Vector2(1,0);
Vector2.unitY = Vector2(0,1);

Vector2.equals = (v1, v2) => {
  return v1.dx === v2.dx && v1.dy === v2.dy;
};
Vector2.plus = (v1,v2) => {
  return Vector2(v1.dx + v2.dx, v1.dy + v2.dy);
};
Vector2.times = (v,s) => {
  return Vector2(s*v.dx, s*v.dy);
};
Vector2.dot = (v1,v2) => {
  return v1.dx*v2.dx + v1.dy*v2.dy;
};
Vector2.magnitude = (v) => {
  return Math.sqrt(Vector2.dot(v,v));
};
Vector2.unit = (v) => {
  const mag = Vector2.magnitude(v);
  return Vector2(v.dx / mag, v.dy / mag);
};
Vector2.project = (v1, v2) => {
  const len = Vector2.dot(v1,v2) / Vector2.dot(v2,v2);
  return Vector2.times(len, v2);
};
Vector2.fromTo = (p1, p2) => {
  return Vector2(p2.x - p1.x, p2.y - p1.y);
};
Vector2.rotate = (v,r) => {
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return Vector2(v.dx*cos - v.dy*sin, v.dx*sin + v.dy*cos);
};
Vector2.fromRotation = (r) => {
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return Vector2(cos, sin);
};
Vector2.angleBetween = (v1, v2) => {
  const dot = Vector2.dot(v1,v2);
  const det = v1.dx * v2.dy - v1.dy * v2.dx;
  return Math.atan2(det, dot);
};
Vector2.toRotation = (v) => {
  return Vector2.angleBetween(Vector2.unitX, v);
};


export {
  Vector2,
  Vector2 as V2,
  Position2,
  Position2 as P2
}
