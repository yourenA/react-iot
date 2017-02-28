var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
  entry: {
    index: [
      './app/index.js'
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router',
    ]
  },
  output: {
    path: './dist',
    publicPath:'/dist/',
    filename:'[name].js',
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css!postcss')
    }, {
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
    }
      , {
        test: /\.less$/,
        loader:  ExtractTextPlugin.extract('style', 'css!postcss!less')
      },
      {test: /\.woff2?$/, loader: 'url?limit=10000&minetype=application/font-woff'},
      {test: /\.ttf$/, loader: 'url?limit=10000&minetype=application/octet-stream'},
      {test: /\.eot$/, loader: 'file'},
      {test: /\.svg$/, loader: 'url?limit=10000&minetype=image/svg+xml'},
      {test: /\.(png|jpg|jpeg|gif)$/i, loader: 'url?limit=10000&name=[name].[ext]'}]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new ExtractTextPlugin('css/app.css'),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8']
    })
  ]
};
