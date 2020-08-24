const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
  output: {
    filename: '[name].bundle.js',
    path: resolve('../dist')
  },
  // 扩展名
  resolve: {
    extensions: ['.js', '.vue', '.css', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'] // 坑：vue-style-loader 不支持 css-loader 4 版本
      },
      {
        test: /\.ttf$/,
        use: 'url-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader', // babel-loader => babel-core => transform => core
          options: {
            presets: ['@babel/preset-env'] // 将 es6 转译成 es5
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(), // 规定使用的
  ]
}