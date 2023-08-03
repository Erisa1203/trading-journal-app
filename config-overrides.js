const { addWebpackModuleRule } = require('customize-cra');

module.exports = function override(config, env) {
  addWebpackModuleRule({
    test: /\.styl$/,
    use: ['style-loader', 'css-loader', 'stylus-loader'],
  })(config, env);
  
  return config;
};
