var fs = require("fs");
//var util = require('util');

function config(key){
	var data = fs.readFileSync('./config/config.json');
	var config = JSON.parse(data.toString());
	return config[key];

}

exports.config = config;
