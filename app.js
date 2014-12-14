var http    = require('http'),
	Router  = require('node-simple-router');

var router = Router({static_route: __dirname + '/static'});

router.get('/hello', function(req, res) {
	res.end('hello world');});
var app = http.createServer(router);
app.listen(8080);

