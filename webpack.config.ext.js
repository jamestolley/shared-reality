const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
//const StringReplacePlugin = require('string-replace-webpack-plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
//const fs = require('fs');

//const base_messenger_content = fs.readFileSync("./src/components/ext-messaging/BaseMessenger.js").toString();
//const good_base_messenger_content = base_messenger_content.replace('export default BaseMessenger;', '');

//console.log(base_messenger_content);

module.exports = {
  mode: process.env.NODE_MODE || 'development', // production
  entry: {
    background: path.resolve(__dirname, 'src/ext/bg.js'),
    content: path.resolve(__dirname, 'src/ext/content.js'),
    popup: path.resolve(__dirname, 'src/ext/popup.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist-ext'),
    filename: '[name].js',
    assetModuleFilename: '[name][ext]',
    clean: true
  },
  //loaders
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src/ext'),
        use: [
          'style-loader',
          'css-loader'
        ]
      },/*
      {
        test: /\.(svg|gif|jpg|jpeg|ico|webp)$/i,
        //include: path.resolve(__dirname, 'src/ext/assets'),
        //type: 'asset/resource',
        loader: 'file-loader',
        options: {
          name: '/assets/[name].[ext]'
        }
      },*/
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                "targets": "defaults" 
              }],
              '@babel/preset-react'
            ]
          }
        }]
      },
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, 'src/ext'),
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      }/*,
      { 
        test: /Messenger.js$/,
        loader: 'string-replace-webpack-plugin',
        options: {
          replacements: [
            {
              pattern: /\/\/ insert base class here/ig,
              replacement: function (match, p1, offset, string) {
                return good_base_messenger_content;
              }
            }
          ]
        }
      }*/
    ]
  },
  plugins: [
    //new HtmlWebpackPlugin({
    //  filename: 'popup.html',
    //  template: 'src/ext/popup.html'
    //}),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/ext/assets"),
          to: path.resolve(__dirname, "dist-ext/assets")
        },
        {
          from: path.resolve(__dirname, "src/ext/manifest.json"),
          to: path.resolve(__dirname, "dist-ext/manifest.json")
        },
        {
          from: path.resolve(__dirname, "src/ext/inject-js"),
          to: path.resolve(__dirname, "dist-ext/inject-js")
        },
        {
          from: path.resolve(__dirname, "src/ext/content.css"),
          to: path.resolve(__dirname, "dist-ext/content.css")
        },
        {
          from: path.resolve(__dirname, "src/ext/popup.html"),
          to: path.resolve(__dirname, "dist-ext/popup.html")
        },
        {
          from: path.resolve(__dirname, "src/components/ext-messaging/InjectedMessenger.js"),
          to: path.resolve(__dirname, "dist-ext/inject-js/InjectedMessenger.js")
        }
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  resolve: {
    fallback: {
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify'),
    }
  }
}