 const webpack = require('webpack');
 const ExtractTextPlugin = require('extract-text-webpack-plugin');
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
 const merge = require('webpack-merge');
 const path = require('path');
 const {
 	VueLoaderPlugin
 } = require('vue-loader')

 const projectRoot = path.resolve(__dirname, './');
 var config = {
 	mode: 'production',
 	output: {
 		path: path.resolve(__dirname, './dist/'),
 		filename: 'vue-amiral-imagelist.js',
 		library: 'vue-amiral-imagelist',
 		libraryTarget: 'umd',
 		umdNamedDefine: true
 	},
 	module: {
 		rules: [
 			// use babel-loader for js files
 			{
 				test: /\.js$/,
 				loader: 'babel-loader',
 				options: {
 					presets: [
 						['@babel/preset-env', {
 							useBuiltIns: 'usage'
 						}]
 					],
 					comments: false
 				},
 				include: projectRoot,
 				exclude: /node_modules/
 			},
 			// use vue-loader for .vue files
 			{
 				test: /\.vue$/,
 				loader: 'vue-loader'
 			},
 			{
 				test: /\.css$/,
 				use: ['vue-style-loader', 'css-loader']
 			},
 			{
				 test: /\.less$/,
				 use: [{
					loader: 'style-loader' // creates style nodes from JS strings
				  }, {
					loader: 'css-loader' // translates CSS into CommonJS
				  }, {
					loader: 'less-loader' // compiles Less to CSS
				  }]
 			}
 		],
 	},
 	optimization: {
 		minimize: true,
 	},
 	plugins: [
 		new VueLoaderPlugin()
 	],
 	externals: {
 		vue: 'vue',
 		// moment: 'moment'
 	} 
 };


 module.exports = [
 	merge(config, {
 		entry: path.resolve(__dirname + '/src/plugin.js'),
 		output: {
 			filename: 'vue-amiral-imagelist.js',
 			// libraryTarget: 'window',
 			libraryTarget: 'umd',
			 library: 'vue-amiral-imagelist',
			 umdNamedDefine: true
 		}
 	}),
 	// merge(config, {
 	// 	entry: path.resolve(__dirname + '/src/AmiralImagelist.vue'),
 	// 	output: {
 	// 		filename: 'vue-amiral-imagelist.js',
 	// 		libraryTarget: 'umd',
 	// 		library: 'vue-amiral-imagelist',
 	// 		umdNamedDefine: true
 	// 	}
 	// }),
 	// merge(config, {
 	// 	entry: path.resolve(__dirname + '/src/AmiralImagelistItem.vue'),
 	// 	output: {
 	// 		filename: 'vue-amiral-imagelist-item.js',
 	// 		libraryTarget: 'umd',
 	// 		library: 'vue-amiral-imagelist-item',
 	// 		umdNamedDefine: true
 	// 	}
 	// }),
 	// merge(config, {
 	// 	entry: path.resolve(__dirname + '/src/AmiralImagelistItemIMGBox.vue'),
 	// 	output: {
 	// 		filename: 'vue-amiral-imagelist-item-imgbox.js',
 	// 		libraryTarget: 'umd',
 	// 		library: 'vue-amiral-imagelist-item-imgbox',
 	// 		umdNamedDefine: true
 	// 	}
 	// }),
 	// merge(config, {
 	// 	entry: path.resolve(__dirname + '/src/AmiralmagelistItemProgress.vue'),
 	// 	output: {
 	// 		filename: 'vue-amiral-imagelist-item-progress.js',
 	// 		libraryTarget: 'umd',
 	// 		library: 'vue-amiral-imagelist-item-progress',
 	// 		umdNamedDefine: true
 	// 	}
 	// })
 ];