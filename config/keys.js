//Keys.js will determine which set of Keys should use for deployment.

if (process.env.NODE_ENV === 'production') {
  module.exports =  require('./prod');
} else {
  module.exports =  require('./dev');
}