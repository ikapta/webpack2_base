require('shelljs/global');
var path = require('path')
var webpack = require('webpack')
var htmlWebpackPlugin = require('html-webpack-plugin')
var express = require('express')
var chalk = require('chalk')
var opn = require('opn')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

var isproduction = process.env.NODE_ENV === 'production';
var extractSass = new ExtractTextWebpackPlugin({
  filename: "css/[name].[hash:7].css",
  disable: !isproduction
});

// 定义文件夹目录
var ROOT_PATH = path.resolve(__dirname, './');
var ASSET_PATH = path.resolve(ROOT_PATH, 'src/asset')
var BUILD_PATH = path.resolve(ROOT_PATH, 'build')
var TEM_PATH = path.resolve(ROOT_PATH, 'src/pages')

// 格式化build发布目录
var clearBuild = function () {
  if (isproduction) {
    rm('-rf', BUILD_PATH)
    // mkdir('-p', BUILD_PATH)
    mkdir('-p', BUILD_PATH + '/static/')
    cp('-R', TEM_PATH + '/static/*', BUILD_PATH + '/static/')
  }
}();

module.exports = {
  entry: {
    index: path.resolve(ASSET_PATH, 'js/index.js'),

  },
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: 'js/[name].[hash:7].js'
  },
  devServer: {
    contentBase: isproduction ? path.join(__dirname, "build") : path.join(__dirname, "build"),
    compress: true,
    host:'0.0.0.0',
    stats: {
      hot: true,
      inline: true,
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    },
    //  children: true,
    watchContentBase: true,
    port: 9000
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  resolve: {
    extensions: ['.js', '.scss', '.css'],
    alias: {
      'img': path.resolve(ASSET_PATH, 'img'),
      'asset': ASSET_PATH
    }
  },
  module: {

    rules: [{
        test: /\.s?css$/,
        loader: extractSass.extract({
          use: [{
              loader: "css-loader"
            },
             {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              }
            },
            {
              loader: 'sass-loader'
            }
          ],
          fallback: "style-loader"
        })
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: ASSET_PATH,
        exclude: /node_modules/
      },
      //     {
      //   test: /.*\.(gif|png|jpe?g|svg)$/i,
      //   loaders: [
      //     'file-loader',
      //     {
      //       loader: 'image-webpack-loader',
      //       query: {
      //         progressive: true,
      //         optimizationLevel: 7,
      //         interlaced: false,
      //         pngquant: {
      //           quality: '65-90',
      //           speed: 4
      //         }
      //       }
      //     }
      //   ]
      // },

      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 100,
          name: path.posix.join('img/[name].[hash:7].[ext]')
        },
        include: ASSET_PATH,
        exclude: /node_modules/
      },

      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: MakePlugins()
}

function MakePlugins() {
  var pg = [extractSass];
  if (isproduction) {
    pg.push(new webpack.optimize.UglifyJsPlugin({
      beautify: false, // 添加适当的空格和换行
      compress: { // 开启代码压缩，包括DCE等
        warnings: false, // 当因为副作用等原因DCE失败时，会在命令行中给出警告
        drop_console: false, // 不用解释了吧
      },
      output: {
        comments: false
      }, // 保留注释，方便寻找`unused harmony`标签
      mangle: false // 禁用变量混淆，以方便分析

    }))
  } 
   pg.push(new htmlWebpackPlugin({
      filename: './index.html',
      template: path.resolve(TEM_PATH, 'index.html'),
      inject: true,
      chunks: ['index'],
      chunksSortMode: 'dependency'
    }))
  return pg;
}

// 自动打开浏览器
!isproduction && opnWeb();
function opnWeb(){
   var uri = getIpv4() + '9000';
   console.log(chalk.yellow.underline.bold('Listening at ' + uri + '\n'))
   opn(uri)
};

function getIpv4() {
    var os = require('os'),
        osIPv4,
        ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        ifaces[dev].forEach(function (details, alias) {
            if (details.family == 'IPv4' && details.address != '127.0.0.1') {
                osIPv4 = details.address;
            }
        });
    }
    return typeof osIPv4 != undefined ? 'http://'+osIPv4+':' : 'http://localhost:';
}