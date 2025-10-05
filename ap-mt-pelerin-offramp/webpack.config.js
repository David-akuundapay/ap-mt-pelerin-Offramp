const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
require("dotenv").config();

module.exports = {
  entry: path.resolve(__dirname, "app/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    publicPath: "/"
  },
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [
      { test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.(png|svg|jpg|gif)$/i, type: "asset/resource" }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.MTP_TOKEN": JSON.stringify(process.env.MTP_TOKEN || "")
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      inject: "body",
      scriptLoading: "defer"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: ".", filter: (f) => !f.endsWith("index.html") }
      ]
    })
  ]
};
