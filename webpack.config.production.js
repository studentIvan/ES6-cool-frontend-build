const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        app: [
            "./src/scripts/app.js",
            "./src/templates/index.pug",
        ]
    },
    stats: { colors: true },
    colors: true,
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/",
        filename: "scripts/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.pug$/,
                exclude: /node_modules/,
                loader: 'file?name=[name].html!extract!html!pug-html-loader?exports=false'
            },
        ],
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader'
            }
       ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
}