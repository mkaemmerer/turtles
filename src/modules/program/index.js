import React from 'react';
import PropTypes from 'prop-types';
import { propertyLens, indexLens } from 'utils/lenses';
import Number from 'components/number';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const amountLens = propertyLens('amount');

const Command = (props) => {
  switch(props.command.type) {
    case 'move': return (<MoveCommand {...props}/>);
    case 'turn': return (<TurnCommand {...props}/>);
  }
};
Command.propTypes = {
  command: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

const MoveCommand = ({command, onChange}) => {
  const onValueChange = (e) => onChange(amountLens.set(command, +e.target.value));
  return (
    <span>
      move <input type="number" value={command.amount} onChange={onValueChange}/>
      <Number value={command.amount}/>
    </span>
  );
};
const TurnCommand = ({command, onChange}) => {
  const onValueChange = (e) => onChange(amountLens.set(command, +e.target.value));
  return (
    <span>
      turn <input type="number" value={command.amount} onChange={onValueChange}/>
      <Number value={command.amount}/>
    </span>
  );
};


const Program = (props) => {
  const {
    commands,
    onCommandChange
  } = props;

  const children = commands.map((command, i) => {
    const lens = indexLens(i);
    const onChange = (newValue) => { onCommandChange(lens, newValue); };

    return (
      <div key={i} className={cx('program_line')}>
        <Command command={command} onChange={onChange}/>
      </div>
    );
  });

  return (
    <div className={cx('program')}>
      {children}
    </div>
  );
};
Program.propTypes = {
  commands: PropTypes.array.isRequired,
  onCommandChange: PropTypes.func.isRequired
};

export default Program;
