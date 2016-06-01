const path = require('path');
const webpack = require('webpack');
const validate = require('webpack-validator');
const PATHS = {
	app: path.join(__dirname, 'app'), 
	build: path.join(__dirname, 'build')
};

const config = {
	entry: {
		app: PATHS.app
	}, 
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: PATHS.build, 
		filename: '[name].js'
	}, 
	devtool: 'source-map',
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	],
	module: {
		loaders: [
			{
				test: /\.css$/, 
				loaders: ['style', 'css'], 
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
