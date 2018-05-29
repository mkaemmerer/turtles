const Mark = (type, data) => ({type, ...data});
Mark.Line  = ({from, to}) => Mark('Mark.Line', {from, to});
Mark.Turn  = ({position, from, to, degrees}) => Mark('Mark.Turn', {position, from, to, degrees});

export default Mark;
