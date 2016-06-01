const path = require('path');
const webpack = require('webpack');
const validate = require('webpack-validator');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require ('purifycss-webpack-plugin');

const PATHS = {
	app: path.join(__dirname, 'app'), 
	style: path.join(__dirname, 'app', 'main.css'),
	build: path.join(__dirname, 'build')
};

const pkg = require('./package.json');

const config = {
	entry: {
		app: PATHS.app, 
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
				from: './app/RPGdiceHangoutExtension.xml'
			}]
		), 
		new CleanWebpackPlugin([PATHS.build], {
			root: process.cwd()
		}), 
		new PurifyCSSPlugin({
			basePath: process.cwd(),
			paths: [PATHS.app]
		})
	],
	module: {
		loaders: [
			{
				test: /\.css$/, 
				loader: ExtractTextPlugin.extract('style', 'css'), 
				include: PATHS.app
			}, 
			{
				test: /\.jsx?$/,
				loaders: ['babel?cacheDirectory'], 
				include: PATHS.app
			}
		]
	}
};

module.exports = validate(config);
