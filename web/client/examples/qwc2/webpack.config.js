var path = require("path");
var DefinePlugin = require("webpack/lib/DefinePlugin");

module.exports = {
    entry: {
        qwc2: path.join(__dirname, "app")
    },
    output: {
      path: path.join(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "qwc2.js"
    },
    plugins: [
        new DefinePlugin({
            "__DEVTOOLS__": true
        })
    ],
    resolve: {
      extensions: ["", ".js", ".jsx"]
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css'},
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?name=[path][name].[ext]&limit=8192'}, // inline base64 URLs for <=8k images, direct URLs for the rest
            { test: /\.jsx?$/, loader: "babel-loader" }
        ]
    },
    devtool: 'inline-source-map',
    debug: true
};
