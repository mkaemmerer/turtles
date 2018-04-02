const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
			{
				test: /\.tt$/,
				use: ['turtletalk-loader']
			}
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html'
    })
  ],
  resolve: {
		alias: {
			'utils':      path.resolve(__dirname, 'src/utils/'),
      'style':      path.resolve(__dirname, 'src/style/'),
			'program':    path.resolve(__dirname, 'src/program/'),
			'components': path.resolve(__dirname, 'src/components/'),
			'modules':    path.resolve(__dirname, 'src/modules/'),
			'pages':      path.resolve(__dirname, 'src/pages/')
		}
	},
	resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  }
};
