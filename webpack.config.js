const path = require("path");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const MiniCssExtractPLugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  context: path.resolve(__dirname, "src"),
  entry: ["./index.js", "./style.css"],
  module: {
    rules: [
      {
        test: /.(js)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /.(css)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPLugin.loader,
          },
          "css-loader",
        ],
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new HtmlMinimizerPlugin()],
  },
  plugins: [
    new MinifyPlugin(
      {},
      {
        comments: false,
      }
    ),
    new MiniCssExtractPLugin({
      filename: "[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "img", to: "img" }, { from: "*.html" }],
    }),
    // new HtmlWebpackPlugin({
    //   template: "./index.html",
    //   filename: "index.html",
    // }),
    // new HtmlWebpackPlugin({
    //   template: "./privacy.html",
    //   filename: "privacy.html",
    // }),
  ],
};
