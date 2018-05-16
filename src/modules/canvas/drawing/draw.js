const turnPath = (angle) => {
  const arc = 0;
  const sweep = 0;

  const f =  -0.6;
  const z =  15;
  const r0 = 15;
  const r1 = r0+1;
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
      r0*cos - z*sin,
      r0*sin + z*cos
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

export {
 turnPath
}
