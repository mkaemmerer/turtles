import React from 'react';
import PropTypes from 'prop-types';
import { indexLens, safeLens } from 'utils/lenses';
import Mark from './mark';

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
    const children = marks.map((mark, i) => {
      const lens = indexLens(i);
      const isHighlighted = safeLens(lens, false).get(highlightedMarks);
      const onMouseEnter  = () => { onHoverChange(lens); };
      const onMouseLeave  = () => { onHoverChange(null); };

      return (
        <Mark
          key={i}
          mark={mark}
          isHighlighted={isHighlighted}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      );
    });
    return (
      <g className={cx('drawing')}>
        {children}
      </g>
    );
  }
}

export default Drawing;
