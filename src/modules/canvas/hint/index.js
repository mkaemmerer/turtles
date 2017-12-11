import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Hint = ({ isVisible }) => {
  const className = cx('hint', { 'hint--visible': isVisible });
  return (
    <div className={className}>
      <span>Ctrl: Snap to nearest 10</span>
      <span>Shift: Fine tune</span>
    </div>
  );
}
Hint.propTypes = {
  isVisible: PropTypes.bool
};

export default Hint;
