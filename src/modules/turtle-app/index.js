import React from 'react';
import program from '../../../programs/square-prims.tt';
import TurtleApp from './turtle-app';

const App = (props) => (
  <TurtleApp
    {...props}
    initialProgram={program}
  />
);

export default App;
