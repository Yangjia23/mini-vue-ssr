const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

const base = require('./webpack.base')

module.exports = merge(base, {
  entry: {
    server: resolve('../src/entry-server.js')
  },
  target:'node', // 服务端打包好的 JS 是给node使用
  output:{
    libraryTarget:'commonjs2' //  指定导出方式
  },
  plugins: [
    new VueSSRServerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.ssr.html',
      template: resolve('../public/index.ssr.html'),
      minify: false, // 不压缩，就不会删除注释
      excludeChunks: ['server']
    })
  ]
})