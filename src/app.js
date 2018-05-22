import React from 'react';
import program from '../programs/square-lambda.tt';
import TurtleApp from 'modules/turtle-app';
import './style/document.scss';

import prettyPrint from 'lang/pretty-print';
console.log(prettyPrint(program));//eslint-disable-line

const App = (props) => (
  <TurtleApp
    {...props}
    initialProgram={program}
  />
);

export default App;
