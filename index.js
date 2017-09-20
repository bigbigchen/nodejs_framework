var server = require("./framework/server");
var router = require("./framework/router");
 
server.start(router.route);

