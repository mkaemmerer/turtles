import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const Program = ({commands}) => {
  const program = commands.map((command, i) => {
    switch(command.type) {
      case 'move': return (<span className={cx('program_line')} key={i}>move {command.amount}</span>);
      case 'turn': return (<span className={cx('program_line')} key={i}>turn {command.amount}</span>);
    }
  });

  return (
    <div className={cx('program')}>
      {program}
    </div>
  );
}
Program.propTypes = {
  commands: PropTypes.array
};

export default Program;
