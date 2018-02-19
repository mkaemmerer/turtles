const compiler = require('../lang/compiler');

// Cacheable loader
module.exports = function(source) {
	this.cacheable();
  return compiler(source);
};
