import React from 'react';
import { ArrowStraight, ArrowCurved } from '../shapes';

const Controls = () => (
  <g>
    <g transform="translate(40,0)rotate(90)">   <ArrowStraight/> </g>
    <g transform="translate(-40,0)rotate(-90)"> <ArrowStraight/> </g>
    <g transform="rotate(135)">                 <ArrowCurved/>   </g>
    <g transform="rotate(-45)">                 <ArrowCurved/>   </g>
  </g>
);

export default Controls;
