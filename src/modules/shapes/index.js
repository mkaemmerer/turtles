import React from 'react';

export const Turtle = () => (
  <polygon points="-8,-20, 16,0, -8,20"/>

);
export const ArrowStraight = () => (
  <path d="
    M -10   5
    L  10   5
    L  10 -20
    L  15 -20
    L   0 -30
    L -15 -20
    L -10 -20
    Z
    "/>
);
export const ArrowCurved = () => (
  <path d="
    M  40   0
    A  40  40, 0 0 0, 0 -40
    L   0 -35
    L -10 -50
    L   0 -65
    L   0 -60
    A  60  60, 0 0 1, 60 0
    L  65   0
    L  50  10
    L  35   0
    Z
    "/>
);
