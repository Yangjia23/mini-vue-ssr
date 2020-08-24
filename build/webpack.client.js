const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

const base = require('./webpack.base')

module.exports = merge(base, {
  entry: {
    client: resolve('../src/entry-client.js')
  },
  plugins: [
    new VueSSRClientPlugin(),
    // new HtmlWebpackPlugin({
    //   template: resolve('../public/index.html')
    // })
  ]
})