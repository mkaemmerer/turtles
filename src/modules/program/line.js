import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const ProgramLine = ({ onMouseEnter, onMouseLeave, isHighlighted, children }) => {
  const className = cx('program_line', { 'program_line--highlighted': isHighlighted });

  return (
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
};
ProgramLine.propTypes = {
  onMouseEnter:  PropTypes.func,
  onMouseLeave:  PropTypes.func,
  isHighlighted: PropTypes.bool,
  children: PropTypes.node
};

export default ProgramLine;
