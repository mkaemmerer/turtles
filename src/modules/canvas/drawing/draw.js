//TODO: this code sucks
const arrowPath = (angle, sign) => {
  const arc   = sign * angle > Math.PI ? 1 : 0;
  const sweep = sign > 0 ? 1 : 0;

  const z = sign * 15;    //width of the arrow
  const f = sign * 0.7;   //height of the arrow (radians)
  const w = 2;            //width of the line

  const r0 = 15;
  const r1 = r0+w;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const p = [
    [
      r0,
      0
    ],
    [
      r0*cos,
      r0*sin
    ],
    [
      r0*cos + z*sin,
      r0*sin - z*cos
    ],
    [
      r1 * Math.cos(angle - f),
      r1 * Math.sin(angle - f)
    ],
    [
      r1,
      0
    ]
  ];

  return `
    M ${p[0]}
    A ${r0} ${r0} 0 ${arc} ${sweep} ${p[1]}
    L ${p[2]}
    L ${p[3]}
    A ${r1} ${r1} 0 ${arc} ${1^sweep} ${p[4]}
    z
  `;
};

const turnPath = (angle) =>
  (angle > 0)
    ? arrowPath(angle, 1)
    : arrowPath(angle, -1);

export {
 turnPath
};
