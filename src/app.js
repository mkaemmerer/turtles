import TurtleApp from 'modules/turtle-app';
import './style/document.scss';

import runProgram from './evaluate';
import program from './square.tt';

for(const trace of runProgram(program)) {
  console.log(trace); //eslint-disable-line
}


export default TurtleApp;
