import React from 'react';
import program from '../programs/square-vars.tt';
import TurtleApp from 'modules/turtle-app';
import './style/document.scss';

const App = (props) => (
  <TurtleApp
    {...props}
    initialProgram={program}
  />
);

export default App;
