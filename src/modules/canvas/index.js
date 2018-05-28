import MakeDraggable from './managed/draggable';
import MakePannable from './managed/pannable';
import Canvas from './canvas';

export default MakeDraggable(MakePannable(Canvas));
