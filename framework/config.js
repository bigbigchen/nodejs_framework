var fs = require("fs");
var util = require('util');

function config(key){
	if(key == "web_root"){//网站根目录
		return __dirname + "/../";
	}

	var data = fs.readFileSync('./config/config.json');
	var config = JSON.parse(data.toString());
	return config[key];

}

exports.config = config;
