
var http = require("http");
var url = require("url");
var util = require('util');
var config = require('./config');

function start(route) {
	function onRequest(request, response) {
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(route(request));
		//response.end(util.inspect(url.parse(request.url, true)));
		response.end();
	}

	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.start = start;

