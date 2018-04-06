const Out = (type, data) => ({type, ...data});
Out.Move  = ({distance}) => Out('Out.Move', {distance});
Out.Turn  = ({degrees})  => Out('Out.Turn', {degrees});

export default Out;
