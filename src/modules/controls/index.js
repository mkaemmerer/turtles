import React from 'react';
import { ShapeArrowStraight, ShapeArrowCurved } from 'components/shapes';

const Controls = () => (
  <g>
    <g transform="translate(40,0)rotate(90)">   <ShapeArrowStraight/> </g>
    <g transform="translate(-40,0)rotate(-90)"> <ShapeArrowStraight/> </g>
    <g transform="rotate(135)">                 <ShapeArrowCurved/>   </g>
    <g transform="rotate(-45)">                 <ShapeArrowCurved/>   </g>
  </g>
);

export default Controls;
