import React from 'react';
import PropTypes from 'prop-types';
import { linePath } from './draw-path';

import styles from './pen.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const match = (node, handlers) => handlers[node.type](node);

const Pen = ({mark, ...props}) =>
  match(mark, {
    'Mark.Line'(data){ return (<PenLine {...props} data={data}/>); },
    'Mark.Turn'(){ return null; }
  });
Pen.propTypes = {
  mark: PropTypes.object.isRequired
};

const PenLine = ({ data }) => {
  const { from, to } = data;
  return (<path className={cx('pen')} d={linePath(from, to)} />);
};

export default Pen;
