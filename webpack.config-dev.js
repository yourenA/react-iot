var webpack = require('webpack')
var path = require('path')
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var autoprefixer=require('autoprefixer');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    // contentBase: './static',
    port: 8080

  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'app/index.js')
  ],
  output: {
    path: __dirname + '/build',
    publicPath: 'static',
    filename: './bundle.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css!postcss'
    }, {
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass!postcss'
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    },
      {test: /\.woff2?$/, loader: 'url?limit=10000&minetype=application/font-woff'},
      {test: /\.ttf$/, loader: 'url?limit=10000&minetype=application/octet-stream'},
      {test: /\.eot$/, loader: 'file'},
      {test: /\.svg$/, loader: 'url?limit=10000&minetype=image/svg+xml'},
      {test: /\.(png|jpg|jpeg|gif)$/i, loader: 'url?limit=10000&name=[name].[ext]'},
      {test: /\.json$/, loader: 'json'},
      {test: /\.html?$/, loader: 'file?name=[name].[ext]'}]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8']
    })
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"'
      }
    }),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    })
  ]
};
