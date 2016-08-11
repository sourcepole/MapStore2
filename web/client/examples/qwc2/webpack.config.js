var path = require("path");

module.exports = {
    entry: {
        myapp: path.join(__dirname, "app")
    },
    output: {
      path: path.join(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "qwc2.js"
    },
    resolve: {
      extensions: ["", ".js", ".jsx"]
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css'},
            { test: /\.jsx?$/, loader: "babel-loader" }
        ]
    },
    devtool: 'inline-source-map',
    debug: true
};
