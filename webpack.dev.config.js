let webpack = require('webpack');
let path = require('path');
let OpenBrowserPlugin = require('open-browser-webpack-plugin');
let autoprefixer=require('autoprefixer');
module.exports = {
    devServer: {
        hot: true,
        inline: true,
        progress: true,
        port: 7070,
        host: '0.0.0.0'
    },
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
      {test: /\.json$/, loader: 'json'}]
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            }
        }),
        new OpenBrowserPlugin({
            url: 'http://localhost:7070'
        })
    ]
};
