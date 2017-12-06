const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');

function getEntrySources(sources) {
	if (process.env.NODE_ENV !== 'production') {
		sources.push('webpack-dev-server/client?http://localhost:8080');
		sources.push('webpack/hot/only-dev-server');
	}

	return sources;
}

module.exports = {
	entry: {
		index: getEntrySources([
			'./src/index.js'
		])
	},
	resolve: {
		alias: {
			'utils':      path.resolve(__dirname, 'src/utils/'),
			'components': path.resolve(__dirname, 'src/components/'),
			'modules':    path.resolve(__dirname, 'src/modules/')
		}
	},
	output: {
		publicPath: 'http://localhost:8080/',
		filename: 'public/[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel-loader', 'eslint-loader'],
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'sass-loader']
			},
			{
				test: /\.svg$/,
				loaders: ['babel-loader', 'react-svg-loader?jsx=true']
			}
		]
	},
	plugins: [
		new StyleLintPlugin({
			syntax: 'scss'
		})
	]
};
