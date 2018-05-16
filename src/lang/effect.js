const Effect = (type, data) => ({type, ...data});
Effect.Move  = ({distance}) => Effect('Effect.Move', {distance});
Effect.Turn  = ({degrees})  => Effect('Effect.Turn', {degrees});

export default Effect;
