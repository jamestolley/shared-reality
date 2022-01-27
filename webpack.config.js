const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_MODE || 'development', // production
  entry: {
    main: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist-web'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: '[name].[contenthash][ext]',
    clean: true
  },
  devtool: 'inline-source-map',
  devServer: {
    //port: 5001, // dfault 8080
    open: true,
    hot: true,
  },
  //loaders
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(svg|gif|png|jpg|jpeg|ico|webp)$/i,
        type: 'asset/resource'
      },
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
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Just a demo',
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/temp.html')
    })
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