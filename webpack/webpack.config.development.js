var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var ETP = new ExtractTextPlugin({
  filename: 'modules-[name]-[contenthash].css',
  ignoreOrder: false,
  allChunks: true,
})

module.exports = {
  devtool: "source-map",
  entry: ["webpack-hot-middleware/client", "./src/index.js"],
  output: {
    path: path.join(__dirname, "..", "dist"),
    filename: "bundle.js",
    publicPath: "/"
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
            return ETP.extract({
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
    ETP,
    new webpack.DefinePlugin({
      "environment": '"developement"',
      NODE_ENV: JSON.stringify("developement")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({template: path.join("src", "public", "index.ejs")}),
  ],
  resolve: {
    modules: ["node_modules", "src"]
  }
}
