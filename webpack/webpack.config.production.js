var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var rimraf = require('rimraf');

var ETP = new ExtractTextPlugin({
  filename: 'modules-[name]-[contenthash].css',
  ignoreOrder: false,
  allChunks: false,
})

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: path.join(__dirname, "..", "dist"),
    filename: "bundle.js",
    publicPath: "./"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader"
        }]
      },
      {
        test: /\.css$/,
        use: ((env) => {
          if(env == 'production') {
            return ETP.extract({
              use: [{
                loader:'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]--[hash:base64:5]',
                }
              }]
            });
          }
          else {
            return [{
                loader: 'style-loader'
              }, {
                loader:'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]--[hash:base64:5]',
                }
              }
            ];
          }
        })(process.env.NODE_ENV)
      },  
      {
        test: /\.less$/,
        use: ((env) => {
          if(env == 'production') {
            return ExtractTextPlugin.extract({
              use: [{
                loader:'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]--[hash:base64:5]',
                }
              }, {
                loader:'less-loader'
              }]
            });
          }
          else {
            return [{
                loader: 'style-loader'
              }, {
                loader:'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]--[hash:base64:5]',
                }
              }, {
                loader:'less-loader'
              }
            ];
          }
        })(process.env.NODE_ENV)
      },
      {
        test: /\.(ttf|woff|woff2|jpeg|jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: path.join("assets", "/"),
              publicPath: "assets/",
              name: '[name]--[hash:base64:5].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    function() {
      console.log("Clearing /dist directory");
      rimraf.sync(path.join(__dirname, "..", "dist"), require('fs'), (er) => {
        if(er) console.log("Clearing of /dist directory failed", er);
      });
    },
    ETP,
    new webpack.DefinePlugin({
      "environment": '"production"',
      NODE_ENV: JSON.stringify("production")
    }),
    new (webpack.optimize.UglifyJsPlugin),
    new HtmlWebpackPlugin({template: path.join("src", "public", "index.ejs")}),
  ],
  resolve: {
    modules: ["node_modules", "src"],
    plugins: [
      new DirectoryNamedWebpackPlugin()
    ]
  }
}
