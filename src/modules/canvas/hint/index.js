import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Hint = ({ isVisible, children }) => {
  const className = cx('hint', { 'hint--visible': isVisible });
  return (
    <div className={className}>
      {children}
    </div>
  );
}
Hint.propTypes = {
  isVisible: PropTypes.bool,
  children:  PropTypes.node,
};

export default Hint;
