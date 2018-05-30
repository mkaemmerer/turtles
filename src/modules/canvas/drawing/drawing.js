import React from 'react';
import PropTypes from 'prop-types';
import { indexLens, safeLens } from 'utils/lenses';
import Highlight from './highlight';
import Pen from './pen';

class PenMarks extends React.PureComponent {
  static propTypes = {
    marks: PropTypes.array.isRequired
  }

  render() {
    const {marks} = this.props;
    const penMarks = marks.map((mark, i) => (<Pen key={i} mark={mark}/>));

    return (
      <React.Fragment>
        {penMarks}
      </React.Fragment>
    );
  }
}

class Highlights extends React.PureComponent {
  static propTypes = {
    marks: PropTypes.array.isRequired,
    onHoverChange: PropTypes.func.isRequired,
    highlightedMarks: PropTypes.array.isRequired,
    isDragging: PropTypes.bool
  }

  render() {
    const {marks, onHoverChange, highlightedMarks, isDragging} = this.props;
    const highlightMarks = isDragging
      ? []
      : marks;
    const highlights = highlightMarks.map((mark, i) => {
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

    return (
      <React.Fragment>
        {lineHighlights}
        {turnHighlights}
      </React.Fragment>
    );
  }
}

class Drawing extends React.PureComponent {
  static propTypes = {
    marks: PropTypes.array.isRequired,
    onHoverChange: PropTypes.func.isRequired,
    highlightedMarks: PropTypes.array.isRequired,
    isDragging: PropTypes.bool
  }
  render() {
    return (
      <g>
        <PenMarks marks={this.props.marks}/>
        <Highlights {...this.props}/>
      </g>
    );
  }
}

export default Drawing;
