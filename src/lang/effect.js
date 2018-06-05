const Effect = (type, data) => ({type, ...data});
Effect.Move  = ({distance, direction}) => Effect('Effect.Move', {distance, direction});
Effect.Turn  = ({degrees,  direction}) => Effect('Effect.Turn', {degrees, direction});

export default Effect;
