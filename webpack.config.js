const webpack = require('webpack');
const path = require('path');
const schema = require('./src/schema');
const nib = require('nib');

/* signal the using file into the console */
console.log('\x1b[36musing webpack.config.js...\x1b[0m');

Object.keys(schema.entries).forEach(function (key) {
  schema.entries[key] = schema.entries[key].map(function (entry) {
    return './src/' + entry
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
  name: 'bundle',
  entry: schema.entries,
  stats: { colors: true },
  devtool: 'source-map',
  cache: false, // turn off this shit
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'scripts/[name].js'
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
        test: /\.js.es5$/,
        exclude: /node_modules/,
        loader: 'file-loader?name=scripts/[name]'
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        loader: 'file-loader?name=styles/[name].css!extract-loader!css-loader?sourceMap!stylus-loader?sourceMap'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file-loader?name=images/[name].[ext]',
            'image-webpack-loader?bypassOnDebug&optimizationLevel=3&interlaced=false'
        ]
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
            loader: 'apply-loader'
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
    new webpack.LoaderOptionsPlugin({
      test: /\.styl$/,
      stylus: {
        // You can have multiple stylus configs with other names and use them
        // with `stylus-loader?config=otherConfig`.
        default: {
          use: [nib()],
          import: ['~nib/lib/nib/index.styl']
        },
      },
    })
  ],

  devServer: {
    stats: { colors: true },
    contentBase: [path.join(__dirname, 'build')],
    watchOptions: {
      watch: true,
      ignored: /node_modules/
    }
  }
},

/**
 * legacy bundle configuration with babel and babel-polyfill
 */
{
  name: 'bundle.legacy',
  entry: { bundle: './src/bundle.legacy.js' },
  stats: { colors: true },
  devtool: 'none',
  cache: false, // turn off this shit
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'scripts/bundle.legacy.js'
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
      test: /\.pug$/,
      use: [{
        loader: 'null-loader'
      }],
    }]
  },
  plugins: [],
}]
