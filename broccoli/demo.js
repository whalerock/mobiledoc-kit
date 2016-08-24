/* jshint node:true */
var funnel = require('broccoli-funnel');
var babel = require('broccoli-babel-transpiler');

module.exports = function() {
  return funnel(babel('demo/'), {
    destDir: 'demo'
  });
};
