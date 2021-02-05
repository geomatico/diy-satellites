const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    resolve: {
        modules: ['node_modules'],
        alias: {
            shared: path.resolve(__dirname, 'shared')
        }
    },
    devServer: {
        contentBase: './dist',
    },
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'colaboradores.html',
            template: './nav/colaboradores.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'faq.html',
            template: './nav/faq.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'medidores.html',
            template: './nav/medidores.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'medimos.html',
            template: './nav/medimos.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'proyecto.html',
            template: './nav/proyecto.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'referencias.html',
            template: './nav/referencias.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'registro.html',
            template: './nav/registro.html'
        }),
        new CopyPlugin([
            { from: 'img', to: 'img/' },
            { from: 'CNAME', to: 'CNAME', toType: 'file'},
            { from: 'nav', to:'.'}
        ]),
        new Dotenv()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
        ],
    },
};
