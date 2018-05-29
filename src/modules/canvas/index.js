import MakeDraggable from './managed/draggable';
import MakePannable from './managed/pannable';
import Measured from './managed/measured';
import Canvas from './canvas';

export default Measured(MakePannable(MakeDraggable(Canvas)));
