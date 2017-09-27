var url = require("url");
var fs = require("fs");
var config = require("./config");
var statics = require("./static");
var template = require("./template");
function route(request) {
	var url2 = url.parse(request.url,true);
	//如果是静态文件
	var file = url2.pathname.substr(1);
	var data= statics.output(file);
	if(data){
		return data;
	}

	//获取控制器相关的路径
	var path2 = config.config("urlManager")[url2.pathname];
	if(undefined == path2){
		path2 = url2.pathname;
	}   
	if(path2 == "/"){
		path2 = "index/index";
	}
	//console.log(url2.query);

	var path2_arr = path2.replace(/(^\/*)|(\/*$)/g,"").replace("//","/").replace("//","/").replace("//","/").split("/");
	var arr1, d1,  arr2,con;
	var con_path;//用于控制器路径，模板默认路径的处理，公用部分
	var data = {} ;//传递参数给控制器,action,模板引擎等
	var controller = "index";
	var action = "index";
	data.get = {};//默认_GET参数
	data.tpl_path = '';//默认模板路径

	//controller action
	for( d1 in path2_arr){
		con_path = path2_arr.slice(0,parseInt(d1)+1).join("/");
		try{
			con = "../controller/" + con_path + ".js";
			data.tpl_path = con_path;
			controller = require(con);//执行到这里必定存在的，若不存在会报错!
			arr1 = path2_arr.slice(parseInt(d1)+1);
			break;
		}catch(e){
			continue;
		}
	}

	//global get data
	for( d1 in arr1){
		if(d1 == 0){
			action = arr1[d1];
		}else{
			if(parseInt(d1)%2==1){
				data.get[arr1[d1]] = arr1.hasOwnProperty(parseInt(d1)+1)?arr1[parseInt(d1)+1]:'';
			}else{

			}
		}	
	}
	var query = url2.query;
	for(d1 in query){
		data.get[d1] = query[d1];
	}
	

	var res;
	try{
		data.tpl_path += "/" + action + '.html';
		data.tpl = template;
		res = eval("controller." + action + "(data)");
	}catch(e){
		res = "incorrent controller or action!" + path2 ;	
	}

	if(typeof(res) == "string"){
	return res;
	}else{
	return JSON.stringify(res);
	}

}

exports.route = route;

