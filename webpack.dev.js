const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    allowedHosts: ['translate.google.cn'],
    headers: {
      'Access-Control-Allow-Origin': 'translate.google.cn'
    }
  }
})
