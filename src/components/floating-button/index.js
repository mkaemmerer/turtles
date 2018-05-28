import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const FloatingButton = ({name, onClick, children}) => {
  const className = cx('floating-button');
  return (
    <button
      className={className}
      name={name}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
FloatingButton.propTypes = {
  children:   PropTypes.node,
  name:       PropTypes.string,
  onClick:    PropTypes.func
};

export default FloatingButton;
