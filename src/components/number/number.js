import React from 'react';
import PropTypes from 'prop-types';

import styles from './number.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class Number extends React.Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    onMouseDown: PropTypes.func
  }

  render() {
    const { value, onMouseDown } = this.props;
    return (
      <span className={cx('number')} onMouseDown={onMouseDown}>
        <input className={cx('number_hidden-input')} type="number" value={value} readOnly/>
        {value}
      </span>
    );
  }
}

export default Number;
