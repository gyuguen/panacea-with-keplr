const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: './src/index.ts',
        nft: './src/nft.ts',
        my_nft: './src/my_nft.ts',
        nft_exchange: './src/nft_exchange.ts'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'index.html',
            chunks: ["index"],
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'nft.html',
            chunks: ["nft"],
            template: './src/nft.html'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'my_nft.html',
            chunks: ["my_nft"],
            template: './src/my_nft.html'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'nft_exchange.html',
            chunks: ["nft_exchange"],
            template: './src/nft_exchange.html'
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            path: require.resolve("path-browserify"),
            buffer: require.resolve("buffer"),
        }
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};