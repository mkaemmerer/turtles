import React from 'react';
import PropTypes from 'prop-types';
import { indexLens, safeLens } from 'utils/lenses';
import Highlight from './highlight';
import Pen from './pen';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);


class Drawing extends React.PureComponent {
  static propTypes = {
    marks: PropTypes.array.isRequired,
    onHoverChange: PropTypes.func.isRequired,
    highlightedMarks: PropTypes.array.isRequired
  }

  render() {
    const {marks, onHoverChange, highlightedMarks} = this.props;

    const highlights = marks.map((mark, i) => {
      const lens = indexLens(i);
      const isHighlighted = safeLens(lens, false).get(highlightedMarks);
      const onMouseEnter  = () => { onHoverChange(lens); };
      const onMouseLeave  = () => { onHoverChange(null); };

      return (
        <Highlight
          key={i}
          mark={mark}
          isHighlighted={isHighlighted}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      );
    });
    const lineHighlights = highlights.filter((c) => c.props.mark.type === 'Mark.Line');
    const turnHighlights = highlights.filter((c) => c.props.mark.type === 'Mark.Turn');
    const penMarks = marks.map((mark, i) => (<Pen key={i} mark={mark}/>));

    return (
      <g className={cx('drawing')}>
        {penMarks}
        {[...lineHighlights, ...turnHighlights]}
      </g>
    );
  }
}

export default Drawing;
