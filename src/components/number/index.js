import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Number = ({ value }) => (
  <span className={cx('number')}>
    <input className={cx('number_hidden-input')} type="number" value={value} readOnly/>
    {value}
  </span>
);
Number.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Number;
