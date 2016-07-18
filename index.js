var express = require('express');
var app = express();
var favicon = require('serve-favicon');

app.set('port', (process.env.PORT || 5000));

app.use(favicon(__dirname + '/dist/favicon.ico'));

var apiRouter = require('./api');
app.use('/api', apiRouter);

var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  contentBase: 'dist',
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'}
}));

if (process.env.NODE_ENV === 'development') {
  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log,
    path: '/__webpack_hmr'
  }));
}

app.use(function(req, res, next) {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
