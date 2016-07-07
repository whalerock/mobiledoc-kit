/* jshint node:true */
var funnel = require('broccoli-funnel');

module.exports = function() {
  return funnel('./plain-demo', {
    include: ['*.html', '*.js', '*.css'],
    destDir: 'demo'
  });
};
