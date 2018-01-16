import React from 'react';
import PropTypes from 'prop-types';
import { safeLens } from 'utils/lenses';
import ProgramLine from './line';
import Hint from './hint';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

class Program extends React.Component {
  static propTypes = {
    program: PropTypes.object.isRequired,
    onProgramChange: PropTypes.func.isRequired,
    onHoverChange: PropTypes.func.isRequired,
    highlightedCommands: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      isDragging: false
    };
  }

  onDragStart = () => {
    this.setState({ isDragging: true });
  }
  onDragEnd = () => {
    this.setState({ isDragging: false });
  }

  renderLine(line, i) {
    const {program, onProgramChange, onHoverChange, highlightedCommands} = this.props;
    const { command, lens } = line;

    const isHighlighted = safeLens(lens, false).get(highlightedCommands);
    const onCommandChange = (command) => {
      const newProgram = lens.set(program, command);
      onProgramChange(newProgram);
    };
    const onMouseEnter = () => { onHoverChange(line); };
    const onMouseLeave = () => { onHoverChange(null); };

    return (
      <ProgramLine
        key={i}
        command={command}
        isHighlighted={isHighlighted}
        onCommandChange={onCommandChange}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      />
    );
  }
  renderLines() {
    const { program } = this.props;
    return program.lines().map((line, i) => this.renderLine(line, i));
  }
  render() {
    const { isDragging } = this.state;
    return (
      <div className={cx('program')}>
        <div className={cx('program_lines')}>
          {this.renderLines()}
        </div>
        <div className={cx('program_footer')}>
          <Hint isVisible={isDragging}/>
        </div>
      </div>
    );
  }
}

export default Program;
