const webpack = require('webpack');
const UglifyJS = require('uglify-js');
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OfflinePlugin = require('offline-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const serviceworkerPath = path.resolve('public/sw.js');

const { code: minifiedServiceworker } = UglifyJS.minify(serviceworkerPath, {
  // options taken from https://github.com/NekR/offline-plugin/blob/master/src/service-worker.js#L71
  compress: {
    ie8: false,
    warnings: false,
    dead_code: true,
    drop_console: true,
    unused: true
  },
  output: {
    comments: false,
    beautify: false,
  }
});

fs.writeFileSync(serviceworkerPath, minifiedServiceworker);

const isDevelopment = process.env.NODE_ENV === 'development';
const plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.EnvironmentPlugin(Object.keys(process.env)),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new LodashModuleReplacementPlugin({
    paths: true, // For _.get
    collections: true, // For _.map _.forEach
    shorthands: true, // For _.sortBy
    flattening: true, // For compose
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Popper: ['popper.js', 'default'],
    // In case you imported plugins individually, you must also require them here:
    Util: 'exports-loader?Util!bootstrap/js/dist/util',
    Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown'
  }),
  new webpack.ContextReplacementPlugin(
    /moment[\/\\]locale$/,
    /en|ru/
  ),
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    chunkFilename: '[id].[chunkhash].css'
  }),
  new HtmlWebpackPlugin({
    template: `./src/index.html`,
    inject: true,
    minify: {
      collapseInlineTagWhitespace: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeTagWhitespace: true,
      sortAttributes: true,
      useShortDoctype: true,
      html5: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }
  }),
  new OfflinePlugin({
    ServiceWorker: {
      minify: true,
      events: true,
    }
  })
];

let babelPlugins = [
  '@babel/plugin-transform-runtime',
  ['@babel/plugin-proposal-decorators', { 'legacy': true }],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-dynamic-import',
  'lodash'
];
if (isDevelopment) {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888
  }));
}

module.exports = {
  entry: {
    bundle: `./src/index.js`
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(jsx|js)$/, exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [[
            '@babel/preset-react',
            {
              development: isDevelopment
            }
          ]],
          plugins: babelPlugins
        }
      },

      {
        test: /\.css$/, use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
        ]
      },

      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.gif$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: 'url-loader?mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    moduleIds: 'hashed'
  },
  plugins,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  stats: {
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'public'),
    bonjour: false,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  }
};
