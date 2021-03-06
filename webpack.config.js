const webpack = require('webpack');
const path = require('path');
const schema = require('./src/entries/schema');
const package = require('./package');

/* webpack plugins */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/* signal the using file into the console */
console.log('\x1b[36musing webpack.config.js...\x1b[0m');

Object.keys(schema.entries).forEach(function (key) {
  if (!Array.isArray(schema.entries[key])) {
    schema.entries[key] = [schema.entries[key]];
  }

  schema.entries[key] = schema.entries[key].filter(function (entry) {
    return entry.split(':').indexOf('production-only') !== 0 
  });

  schema.entries[key] = schema.entries[key].map(function (entry) {
    return './src/entries/' + entry;
  });

  schema.entries[key] = 
    ['webpack-dev-server/client?http://localhost:8080/']
    .concat(schema.entries[key]);
});

module.exports = [
/**
 * main configuration
 * you can configure the entry points in the src/schema.json
 */
{
  name: 'project',
  entry: schema.entries,
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false
  },
  performance: {
    maxInitialChunkSize: 400000,
    maxAssetSize: 400000,
  },
  devtool: 'eval',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'scripts/[name]/[name].js',
    chunkFilename: 'scripts/chunks/[id].[hash].chunk.js'
  },

  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.jsx'],
    mainFiles: ['index'],
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.sa?c?ss$/,
        loader: ExtractTextPlugin.extract({
          loader: [
            {
              loader: 'css-loader',
              query: {
                sourceMap: true,
                // importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: true,
                outputStyle: 'expanded',
                data: '@import "global.sass"',
                includePaths: [
                  path.join(__dirname, 'node_modules'),
                  path.join(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets'),
                  path.join(__dirname, 'src'),
                  path.join(__dirname, 'src/styles'),
                ]
              }
            },
          ]
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url-loader?name=images/[hash].[ext]&limit=10000',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=3&interlaced=false'
        ]
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'apply-loader',
            options: {
              args: [{
                version: package.version || '0.0.1'
              }]
            }
          },
          {
            loader: 'pug-loader',
            options: {
              pretty: true,
              root: path.resolve(__dirname, 'src')
            }
          },
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['build/scripts/chunks'], { verbose: false }),
    new ExtractTextPlugin('styles/[name].css'),
  ],

  devServer: {
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: true,
      assets: false,
      chunks: false,
      modules: false,
      reasons: true,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false
    },
    contentBase: [path.join(__dirname, 'build')],
    watchOptions: {
      watch: true,
      ignored: /node_modules/
    }
  }
},

/**
 * legacy bundle configuration with babel and babel-polyfill
 * + babelify acme.js
 */
{
  name: 'bundle.legacy',
  entry: {
    'core/acme': './src/entries/core/acme.js',
    'bundle.legacy': './src/entries/legacy/bundle.legacy.js'
  },
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false
  },
  performance: { hints: false },
  devtool: 'none',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/core/[id].[hash].chunk.js'
  },

  resolve: {
    modules: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules')],
    extensions: ['.js', '.jsx'],
    mainFiles: ['index'],
  },

  module: {
    rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: [
            'system-import-transformer',
            'transform-es2015-template-literals',
            'transform-es2015-literals',
            'transform-es2015-function-name',
            'transform-es2015-arrow-functions',
            'transform-es2015-block-scoped-functions',
            'transform-es2015-classes',
            'transform-es2015-object-super',
            'transform-es2015-shorthand-properties',
            'transform-es2015-computed-properties',
            'transform-es2015-for-of',
            'transform-es2015-sticky-regex',
            'transform-es2015-unicode-regex',
            'check-es2015-constants',
            'transform-es2015-spread',
            'transform-es2015-parameters',
            'transform-es2015-destructuring',
            'transform-es2015-block-scoping',
            'transform-es2015-typeof-symbol',
            ['transform-regenerator', { async: false, asyncGenerators: false }],
          ],
        }
      }],
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.(pug|sa?c?ss|styl|css|jpe?g|png|gif)$/,
      use: [{
        loader: 'null-loader'
      }],
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['build/scripts/core'], { verbose: false })
  ],
}]
