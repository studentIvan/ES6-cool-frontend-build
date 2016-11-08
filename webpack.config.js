const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        app: [
            "webpack-dev-server/client?http://localhost:8080/", 
            "./src/scripts/app.js",
            "./src/templates/index.pug",
        ]
    },
    stats: { colors: true },
    colors: true,
    devtool: 'source-map',
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
                loader: 'file?name=[name].html!extract!html?minimize=false!pug-html-loader?exports=false&pretty'
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
    plugins: []
}