var express = require('express');
var app = express();

app.set('views', __dirname + '/app');
app.engine('html', require('ejs').renderFile);


app.get('/', function (req, res) {
  res.render('index.html');
})

var server = app.listen(3000, function () {
	console.log(__dirname);
});