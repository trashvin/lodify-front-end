const webpack = require("webpack");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: "./app/js/index.js",
  output: {
    filename: "./app/dist/bundle.js"
  },
  module:{
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"],
          plugins: ["transform-es2015-for-of","transform-es2015-arrow-functions","transform-es2015-block-scoping"],
        }
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"])
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "./app/dist/[name].bundle.css",
      allChunks: true
    }),
    
    //Commented in dev ,Uglify >=0.4.6 dont support ES6
    /*
        new webpack.optimize.UglifyJsPlugin({
            compressor: { warnings: false }
        }),
        new UglifyJSPlugin()
        */
  ]
};