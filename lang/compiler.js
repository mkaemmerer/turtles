const parser = require('./parser');

const print = (AST) => `
  const AST = ${JSON.stringify(AST)};
  module.exports = AST;
`;

module.exports = function(source) {
  const ast = parser.tryParse(source);
  return print(ast);
};
