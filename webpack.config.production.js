const webpack = require('webpack');
const path = require('path');
const schema = require('./src/entries/schema');
const package = require('./package');
const bootstrap = require('bootstrap-styl');
const nib = require('nib');

/* webpack plugins classes */
const CleanWebpackPlugin = require('clean-webpack-plugin');

/* webpack plugins */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* signal the using file into the console */
console.log('\x1b[36musing webpack.config.production.js...\x1b[0m');

let productionLegacy = ['./src/entries/legacy/bundle.legacy.js'];

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
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    mainFiles: ['index'],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.json'
        }
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
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract([
          'css-loader?minimize&importLoaders=1',
          'stylus-loader'
        ])
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
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendors']
    }),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      __dirname
    ),
    new webpack.LoaderOptionsPlugin({
      test: /\.styl$/,
      stylus: {
        default: {
          paths: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'src'),
            path.join(__dirname, 'src/styles'),
          ],
          use: [nib(), bootstrap()],
          import: [
            '~nib/lib/nib/index.styl',
            path.join(__dirname, 'src/styles/configuration.styl'),
            path.join(__dirname, 'src/styles/core.styl'),
          ],
          'resolve url': true,
          'include css': true
        },
      },
    }),
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
    }),
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
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    mainFiles: ['index'],
  },

  module: {
    rules: [
    {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.production.json'
        }
    },
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
      test: /\.(pug|styl|css|jpe?g|png|gif)$/,
      use: [{
        loader: 'null-loader'
      }],
    }]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      __dirname
    ),
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
