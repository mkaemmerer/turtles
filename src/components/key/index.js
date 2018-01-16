import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Key = ({name}) => (
  <span className={cx('key')}>
    {name}
  </span>
);
Key.propTypes = {
  name: PropTypes.string.isRequired
};

export default Key;
