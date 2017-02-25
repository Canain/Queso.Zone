'use strict';

const webpack = require('webpack');
const precss = require('precss');
const cssnext = require('postcss-cssnext');

const node = {};

['fs', 'net'].forEach(m => node[m] = 'empty');

module.exports = {
	entry: './src/browser/ts/main.tsx',
	output: {
		filename: './public/bundle.js'
	},
	module: {
		loaders: [
			{
				test: /react-icons\/(.)*(.js)$/,
				loader: 'babel-loader'
			},
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.s?css$/,
				loader: 'style-loader!css-loader!postcss-loader'
			}
		]
	},
	node: node,
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: () => [precss, cssnext]
			}
		}),
		new webpack.SourceMapDevToolPlugin()
	]
};
