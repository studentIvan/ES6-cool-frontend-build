const webpack = require("webpack");
const path = require("path");
const config = require("./webpack.config")('production');
// const fs = require('fs');

const compiler = webpack(config);

compiler.run(function(err, stats) {
    // fs.writeFile("./build/index.html", pug.renderFile('./src/templates/index.pug', {
    //     pretty: true
    // }));
    console.log(stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
    }))
})