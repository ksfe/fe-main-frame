var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
//var ExtractTextPlugin = require('extract-text-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var UglifyJsPlugin = require('terser-webpack-plugin');
require('babel-polyfill')
var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
    entry: {
        app: './src/main.js',
    },
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    performance: {
        hints: false
    },
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: config.build.productionSourceMap,
                terserOptions: {
                    warnings: false,
                    compress: {
                        drop_console: true
                    }
                }
            }),
            new OptimizeCSSPlugin({
                cssProcessorOptions: config.build.productionSourceMap ? {
                    safe: true,
                    map: {inline: false}
                } : {safe: true}
            }),
        ],
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 10,
            maxInitialRequests: 6,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test(module, chunks) {
                        return (
                            module.resource &&
                            /[\\/]node_modules[\\/]/.test(module.resource) &&
                            module.resource.indexOf('monaco-editor') < 0 &&
                            module.resource.indexOf('echarts') < 0 &&
                            module.resource.indexOf('jsplumb') < 0)
                    },
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10
                }

            }
        }
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            //chunksSortMode: 'dependency'
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            },
            {
                from: './src/libs/echarts.js',
                to: config.build.assetsSubDirectory + '/js',
                //ignore: ['.*']
            },
            {
                from: './src/libs/jsplumb.js',
                to: config.build.assetsSubDirectory + '/js',
                //ignore: ['.*']
            },
            {
                from: './src/libs/monaco',
                to: config.build.assetsSubDirectory + '/js/monaco',
                //ignore: ['*']
            },
        ]),

    ]
});


if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
