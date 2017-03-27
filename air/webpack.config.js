var webpack = require('webpack')

module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css'},
      // {
      //       test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
      //       loaders: [
      //           // 小于10KB的图片会自动转成dataUrl
      //           'url?limit=10240&name=img/[hash:8].[name].[ext]',
      //           'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
      //       ]
      //   },
        // {
        //     test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        //     loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
        // },
        { test: /\.(tpl|ejs)$/, loader: 'ejs'},
        // {test: /\.css$/, loader: 'style-loader!css-loader'},
        { test: /\.scss$/, loader: 'style!css!sass'},
        { test: /\.html|\.json$/, loader: "string" },
        { test: /\.(jpg|png|jpg|png|woff|eot|ttf|svg|gif)$/, loader:"file-loader?name=./img/[name].[ext]"},
        { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
        // {
        //   test: /.*\.(gif|png|jpe?g|svg)$/i,
        //   loaders: [
        //     'file?hash=sha512&digest=hex&name=[hash].[ext]',
        //     'image-webpack'
        //   ]
        // }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('This file is created by wanghui')
  ]
}