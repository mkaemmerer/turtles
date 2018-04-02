const parser = require('../build/parser').default;

const print = (AST) => `
  const AST = ${JSON.stringify(AST)};
  module.exports = AST;
`;
const compile = (source) => {
  const ast = parser.tryParse(source);
  return print(ast);
};

// Cacheable loader
module.exports = function(source) {
	this.cacheable();
  return compile(source);
};
