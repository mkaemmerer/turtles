import React from 'react';
import PropTypes from 'prop-types';
import { printBlock } from './ast';

import styles from './lines.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

const match = (node, handlers) => handlers[node.type](node);

const layout = (doc) => match(doc, {
  'Doc.Empty': () => [],
  'Doc.Text': ({text,  doc}) => {
    const [line = [], ...lines] = layout(doc);
    return [[text, ...line], ...lines];
  },
  'Doc.Line': ({depth, doc}) => {
    const [line = [], ...lines] = layout(doc);
    const indent = (
      <span key="indent" style={{whiteSpace: 'pre'}}>
        {`${'  '.repeat(depth)}`}
      </span>
    );
    return [[], [indent, ...line], ...lines];
  }
});

const Line = ({ onMouseEnter, onMouseLeave, isHighlighted, children }) => {
  const className = cx('line', { 'line--highlighted': isHighlighted });
  return (
    <div className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
};
Line.propTypes = {
  onMouseEnter:  PropTypes.func,
  onMouseLeave:  PropTypes.func,
  isHighlighted: PropTypes.bool,
  children: PropTypes.node
};


const Lines = ({program, onChange}) => {
  const programProps = {
    onChange: (value, lens) => {
      onChange(lens.set(program, value));
    }
  };
  const doc = printBlock(programProps, program);

  const lines = layout(doc);
  const lineElements = lines.map((line, i) => (
    <Line key={i}>{React.Children.toArray(line)}</Line>
  ));
  return (
    <React.Fragment>
      {lineElements}
    </React.Fragment>
  )
};
export default Lines;
