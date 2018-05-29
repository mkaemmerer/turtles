const arrowPath = (angle, sign) => {
  const arc   = sign * angle > Math.PI ? 1 : 0;
  const sweep = sign > 0 ? 1 : 0;

  const r = 15;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const p = [
    [ r, 0 ],
    [ r*cos, r*sin ]
  ];

  return `
    M ${p[0]}
    A ${r} ${r} 0 ${arc} ${sweep} ${p[1]}
  `;
};
const turnPath = (angle) =>
  (angle > 0)
    ? arrowPath(angle, 1)
    : arrowPath(angle, -1);

const linePath = (from, to) => `
    M ${from.x} ${from.y}
    L ${to.x} ${to.y}
  `;

export {
  linePath,
  turnPath
};
