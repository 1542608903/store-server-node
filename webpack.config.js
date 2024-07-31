const path = require('path');
const nodeExternals = require('webpack-node-externals'); // 确保正确引入


module.exports = {
  mode: 'production', // 或 'production'，根据你的需求选择
  entry: './src/main.js', // 入口文件
  target: 'node', // 打包为 Node.js 环境
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 输出文件名
  },
  externals: [nodeExternals()], // 排除 Node.js 核心模块和 npm 模块
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // 使用 Babel 转译
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  stats: {
    // 输出详细的构建信息
    all: false,
    errors: true,
    warnings: true,
    modules: true,
    entrypoints: true
  }
};
