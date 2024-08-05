const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/main.js", // 替换为你的 Koa 应用入口文件
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};
