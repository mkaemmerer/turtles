const match = (node, handlers) => handlers[node.type](node);

export default match;
