const path = require('path');
const webpack = require('webpack');
const validate = require('webpack-validator');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require ('purifycss-webpack-plugin');

const PATHS = {
	src: path.join(__dirname, 'src'), 
	style: path.join(__dirname, 'src', 'main.css'),
	build: path.join(__dirname, 'build')
};

const pkg = require('./package.json');

const config = {
	entry: {
		src: PATHS.src, 
		style: PATHS.style,
		vendor: Object.keys(pkg.dependencies)
	}, 
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	devtool: 'source-map',
	output: {
		path: PATHS.build, 
		filename: '[name].[chunkhash].js',
		chunkFilename: '[chunkhash].js'
	}, 
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}), 
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}), 
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest'], 
			minChunks: Infinity
		}),
		new ExtractTextPlugin('[name].[chunkhash].css'), 
		new CopyWebpackPlugin(
			[{
				from: './src/RPGdiceHangoutExtension.xml'
			}]
		), 
		new CleanWebpackPlugin([PATHS.build], {
			root: process.cwd()
		}), 
		new PurifyCSSPlugin({
			basePath: process.cwd(),
			paths: [PATHS.src]
		})
	],
	module: {
		preLoaders: [
			{
				test: /\.jsx?$/, 
				loaders: ['eslint'], 
				include: PATHS.src
			}
		], 
		loaders: [
			{
				test: /\.css$/, 
				loader: ExtractTextPlugin.extract('style', 'css'), 
				include: PATHS.src
			}, 
			{
				test: /\.jsx?$/,
				loaders: ['babel?cacheDirectory'], 
				include: PATHS.src
			}
		]
	}
};

module.exports = validate(config);
