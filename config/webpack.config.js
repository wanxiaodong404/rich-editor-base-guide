/*
 * @Author: wanxiaodong
 * @Date: 2020-01-06 17:39:30
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-01-16 11:39:45
 * @Description: 
 */
const path  =  require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CleanWebpackPlugin = require('clean-wexbpack-plugin')
module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js',
        focus: './src/focus.jsx',
        editor: './src/editor.jsx',
        editorNative: './src/editor-native.jsx'
    },
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: '[name].bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        open: true,
        port: 3111
    },
    module: {
        rules: [
            {
                test: /js[x]?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-react', '@babel/preset-env']
                }
            },
            {
                test: /less/,
                use:[
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './template/editor.html',
            filename: 'editor-draft.html',
            chunks: ['main', 'editor']
        }),
        new HtmlWebpackPlugin({
            filename: 'editor-native.html',
            template: './template/editor.html',
            chunks: ['main', 'editorNative']
        }),
        new HtmlWebpackPlugin({
            filename: 'focus.html',
            template: './template/focus.html',
            chunks: ['main', 'focus']
        })
    ]
}