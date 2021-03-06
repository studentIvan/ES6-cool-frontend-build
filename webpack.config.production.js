const webpack = require('webpack');
const path = require('path');
const schema = require('./src/entries/schema');
const package = require('./package');

/* webpack plugins classes */
const CleanWebpackPlugin = require('clean-webpack-plugin');

/* webpack plugins */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let productionLegacy = ['./src/entries/legacy/bundle.legacy.js'];

/* signal the using file into the console */
console.log('\x1b[36musing webpack.config.production.js...\x1b[0m');

Object.keys(schema.entries).forEach(function (key) {
  if (!Array.isArray(schema.entries[key])) {
    schema.entries[key] = [schema.entries[key]];
  }

  schema.entries[key] = schema.entries[key].map(function (entry) {
    if (entry.split(':').indexOf('production-only') === 0) {
      entry = entry.split(':')[1];
      productionLegacy.unshift('./src/entries/' + entry);
    }
    
    return './src/entries/' + entry;
  });
});

module.exports = [
{
  name: 'project',
  entry: schema.entries,
  stats: { colors: true },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'scripts/[name]/[name].js',
    chunkFilename: 'scripts/chunks/[id].[hash].chunk.js'
  },

  resolve: {
    modules: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules')],
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
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url-loader?name=images/[hash].[ext]&limit=10000',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=3&interlaced=false'
        ]
      },
      {
        test: /\.sa?c?ss$/,
        loader: ExtractTextPlugin.extract({
          loader: [
            {
              loader: 'css-loader',
              query: {
                minimize: true,
                // importLoaders: 2,
                discardComments: {
                  removeAll: true
                }
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              query: {
                outputStyle: 'compressed',
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
        test: /\.pug$/,
        exclude: /node_modules/,
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
              pretty: false,
              root: path.resolve(__dirname, 'src')
            }
          },
        ]
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('styles/[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin(['build'], { verbose: false }),
    new webpack.optimize.UglifyJsPlugin({
      'screw-ie8': true,
      compress: true,
      mangle: true,
      comments: false,
      output: { comments: false }
    })
  ]
},
{
  name: 'bundle.legacy',
  entry: {
    'core/acme': './src/entries/core/acme.js',
    'bundle.legacy': productionLegacy
  },
  stats: { colors: true },
  devtool: 'none',
  cache: false, // turn off this shit
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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      'screw-ie8': true,
      compress: true,
      mangle: true,
      comments: false,
      output: { comments: false }
    })
  ],
}]
