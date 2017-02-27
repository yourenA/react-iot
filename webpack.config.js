var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer=require('autoprefixer');
var copy = require('quickly-copy-file');
var del = require('del');

// 开发环境
var isDev = function() {
  return process.env.NODE_ENV.trim() === 'development';
};

// 生产环境
var isProd = function() {
  return process.env.NODE_ENV.trim() === 'production';
};

copyAndDelFiles();

module.exports = {
  devtool: isProd() ? false : 'inline-source-map',
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
    filename: isProd() ? '[name].[chunkhash:8].js' : '[name].js',
    chunkFilename: isProd() ? '[name].chunk.[chunkhash:8].js' : '[name].chunk.js',
    publicPath: isProd() ? './dist/' : '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'react-hot!babel'
      },{
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
      test: /\.scss$/,
      loader: 'style!css!sass!postcss'
      },
      {
      test: /\.less$/,
      loader: 'style!css!less'
      }, {
      test: /\.(png|jpg)$/,
      loader: 'file-loader?name=/[name].[hash:8].[ext]'
      },{test: /\.woff2?$/, loader: 'url?limit=10000&minetype=application/font-woff'},
      {test: /\.ttf$/, loader: 'url?limit=10000&minetype=application/octet-stream'},
      {test: /\.eot$/, loader: 'file'},
      {test: /\.svg$/, loader: 'url?limit=10000&minetype=image/svg+xml'}]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8']
    })
  ],
  plugins: getPlugins()
};

// 复制和删除文件
function copyAndDelFiles() {
  var copyFile = '';

  // 复制文件
  if (isDev()) {
    copyFile = 'app/html/index_dev.html';
  } 

  if (isProd()) {
    copyFile = 'app/html/index.html';
  }

  copy(copyFile, 'index.html', function(error) {
    if (error) {
      return console.error(error);
    }
  });

  if (isProd()) {
    del(['dist']);
  }
}

// 获取配置
function getPlugins() {
  var plugins = [
    new webpack.DefinePlugin({
      __DEV__ : isDev(),
      __PROD__: isProd(),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV.trim())
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', isProd() ? 'vendor.[chunkhash:8].js' : 'vendor.js'),
    new ExtractTextPlugin(isProd() ? '[name].[chunkhash:8].css' : '[name].css'),
  ];

  if (isDev()) {
    plugins.push(
      new OpenBrowserPlugin({ url: 'http://localhost:7070/' })
    );
  }

  if (isProd()) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        output: {
          comments: false,
        },
        compress: {
          warnings: false
        }
      }),
      new HtmlWebpackPlugin({
        title: 'react-platform',
        filename: '../index.html',
        template: './app/html/index.html'
      }),
      new WebpackMd5Hash()
    );
  }

  return plugins
}