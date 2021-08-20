var path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {"crypto":false}
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "public"),
    },
    devServer: {
        port: 5000,
    },
};