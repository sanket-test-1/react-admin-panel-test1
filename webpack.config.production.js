const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const isDevelopment = process.env.NODE_ENV !== "production";

const port = process.env.PORT || 3000;

module.exports = {
  // Webpack configuration goes here
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "static/bundle.[fullhash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devtool: "source-map",
  module: {
    rules: [
      // JS and JSX Loader
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },

      // SCSS Loader
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          // Translates CSS into CommonJS
          "css-loader",
          "resolve-url-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      },

      // CSS Loader
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true
            }
          }
        ]
      },

      // Image Loader
      {
        test: /\.(png|jpg|gif)$/i,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "static/media/[name].[hash:8].[ext]"
          }
        }
      },

      // SVG Loader
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "file-loader"]
      },

      // File Loader
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        type: "asset/resource"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html"
      // favicon: 'public/favicon.ico'
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
      "process.env.NODE_ENV": JSON.stringify(
        isDevelopment ? "development" : "production"
      )
    }),
    new MiniCssExtractPlugin({
      filename: "styles/styles.[fullhash].css"
    })
  ].filter(Boolean)
};
