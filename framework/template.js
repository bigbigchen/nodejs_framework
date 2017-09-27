//获取文件
var fs = require("fs");



//输出
//正则手册http://www.runoob.com/jsref/jsref-obj-regexp.html
function display(tpl_path,tpl_data){
	var tpl_caches_file = "./caches/caches_templates/" + tpl_path.split("/").join("__") + ".js";


	var tpl_root = "./template/";
	var tpl_path2 = tpl_root + tpl_path;
	var res = {};
	res.ret = true;//状态
	res.text = "";//状态说明
	res.content = "";//模板原生内容
	res.output = "";//输出到客户端显示的内容

	try{
		res.content = fs.readFileSync(tpl_path2).toString();	
	}catch(e){
		res.ret = false;
		res.text = "模板读取错误:" + tpl_path2;
	}

	var pattern=new RegExp("^<%.*?%>");
	res.t = ' '+ res.content.match(pattern);
	//var regx = /<%.*?%>/g;
	var regx = /<%[\s\S]*?%>/g;
	//获得所有非代码标签(html)
	var htmls = res.content.split(regx);

	//模板处理
	var tt ;
	var marks = [];//获得所有代码
	var marks_runable = [];//转化为真正可执行的代码
	marks_runable.push('var marks_codes=[]; ')  ; 
	marks_runable.push('function get(data){ ')  ; 
	marks_runable.push('marks_codes=[]; ')  ; 
	var tti=0;//counter
	while( tt = regx.exec(res.content) ){
		marks.push(tt[0]);
		marks_runable.push("marks_codes.push(unescape('"+ escape(htmls[tti]) +"'));");//html标签 
		marks_runable.push(tt[0].replace('<%','').replace('%>',''))  ; 
		tti++;
	}
	marks_runable.push("marks_codes.push(unescape('"+ escape(htmls[tti]) +"'));");//最后html标签 

	//作用：返回结果
	marks_runable.push(" \n return marks_codes; \n}");

	//不断加入
	marks_runable.push(" function p(val){  marks_codes.push(val);  }");
	marks_runable.push(" exports.get=get;");


	/*
 	如果没有模板缓存的话，这样直接执行
	eval(marks_runable.join("\n"));
	return get(tpl_data);;
	*/

	try{
		fs.writeFileSync(tpl_caches_file, marks_runable.join("\n"));
	}catch(e){
		res.ret=0;
		res.text = "模板缓存不存在：" + tpl_caches_file;
		return res;
	}

	var tpl_obj = require("../"+tpl_caches_file);
	res.output = tpl_obj.get(tpl_data);
	return res.output.join("\n");


}


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



exports.display = display;
