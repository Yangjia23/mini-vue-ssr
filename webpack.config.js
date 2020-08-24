const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
  entry: resolve('./src/entry-client.js'),
  output: {
    filename: '[name].bundle.js',
    path: resolve('dist')
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
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
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}