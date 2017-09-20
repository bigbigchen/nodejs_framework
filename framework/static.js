//获取文件
var fs = require("fs");


//打印静态文件
function output(file2){
	var file_origin = file2;
	file2 = "./public/"+file2;
	try{
		var stats = fs.statSync(file2);
		if(stats.isDirectory()){
			file_origin += "/index.html"
			return output(file_origin);
		}
	}catch(e){
		return false;
	}
	return fs.readFileSync(file2);
}



exports.output = output;
