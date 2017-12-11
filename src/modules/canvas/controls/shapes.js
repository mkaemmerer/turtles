import React from 'react';
import { ShapeArrowStraight, ShapeArrowCurved } from 'components/shapes';

export const ShapeMoveForward = () => (
  <g transform="translate(40,0)rotate(90)">
    <ShapeArrowStraight/>
  </g>
);

export const ShapeMoveBackward = () => (
  <g transform="translate(-40,0)rotate(-90)">
    <ShapeArrowStraight/>
  </g>
);

export const ShapeRotateLeft = () => (
  <g transform="rotate(-45)">
    <ShapeArrowCurved/>
  </g>
);

export const ShapeRotateRight = () => (
  <g transform="rotate(135)">
    <ShapeArrowCurved/>
  </g>
);
