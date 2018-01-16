import React from 'react';
import PropTypes from 'prop-types';
import Key from 'components/key';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Hint = ({ isVisible }) => {
  const className = cx('hint', { 'hint--visible': isVisible });
  return (
    <div className={className}>
      <span><Key name="Ctrl"/>: Snap to nearest 10</span>,&nbsp;&nbsp;
      <span><Key name="Shift"/>: Fine tune</span>
    </div>
  );
}
Hint.propTypes = {
  isVisible: PropTypes.bool
};

export default Hint;
