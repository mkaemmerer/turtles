import React from 'react';
import PropTypes from 'prop-types';
import { P2, V2 } from 'utils/vectors';
import Placement from 'utils/placement';
import run from './run';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const toPathString = (path) =>
  'M' + path.map((p) => `${p.position.x}, ${p.position.y}`).join(' L ');

const Drawing = ({commands}) => {
  const initialPlacement = new Placement(
    new P2(100, 100),
    V2.fromRotation(Math.PI/6)
  );
  const placements = run(initialPlacement, commands);
  const pathString = toPathString(placements);

  return (
    <path className={cx('drawing')} d={pathString}/>
  );
}
Drawing.propTypes = {
  commands: PropTypes.array
};

export default Drawing;
