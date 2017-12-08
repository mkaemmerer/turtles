import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Mark = ({output, ...props}) =>
  output.match({
    line(data){ return (<LineMark {...props} data={data}/>); },
  });
Mark.propTypes = {
  output: PropTypes.object.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

const LineMark = ({ data, ...props }) => {
  const { from, to } = data;
  return (<line {...props} x1={from.x} y1={from.y} x2={to.x} y2={to.y}/>);
};


const Drawing = ({output}) => {
  const children = output.map((out, i) => {
    const onMouseEnter = () => {
      console.log(out.lens); //eslint-disable-line
    };
    const onMouseLeave = () => {
      console.log(out.lens); //eslint-disable-line
    };

    return (
      <Mark
        key={i}
        output={out}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  });

  return (
    <g className={cx('drawing')}>
      {children}
    </g>
  );
}
Drawing.propTypes = {
  output: PropTypes.array
};

export default Drawing;
