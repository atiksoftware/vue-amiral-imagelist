const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

var config = {
  output: {
    path: path.resolve(__dirname + '/dist/'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.css$/,
        loader: 'style!less!css'
      }
    ]
  },
  externals: {
    moment: 'moment'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin( {
      minimize : true,
      sourceMap : false,
      mangle: true,
      compress: {
        warnings: false
      }
    } )
  ]
};


module.exports = [
  merge(config, {
    entry: path.resolve(__dirname + '/src/plugin.js'),
    output: {
      filename: 'vue-amiral-imagelist.min.js',
      libraryTarget: 'window',
      library: 'vue-amiral-imagelist',
    }
  }),
  merge(config, {
    entry: path.resolve(__dirname + '/src/AmiralImagelist.vue'),
    output: {
      filename: 'vue-amiral-imagelist.js',
      libraryTarget: 'umd',
      library: 'vue-amiral-imagelist',
      umdNamedDefine: true
    }
  }),
  merge(config, {
    entry: path.resolve(__dirname + '/src/AmiralImagelistItem.vue'),
    output: {
      filename: 'vue-amiral-imagelist-item.js',
      libraryTarget: 'umd',
      library: 'vue-amiral-imagelist-item',
      umdNamedDefine: true
    }
  }),
  merge(config, {
    entry: path.resolve(__dirname + '/src/AmiralImagelistItemIMGBox.vue'),
    output: {
      filename: 'vue-amiral-imagelist-item-imgbox.js',
      libraryTarget: 'umd',
      library: 'vue-amiral-imagelist-item-imgbox',
      umdNamedDefine: true
    }
  })
];
