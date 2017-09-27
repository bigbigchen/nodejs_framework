//获取文件
var fs = require("fs");



//输出
//正则手册http://www.runoob.com/jsref/jsref-obj-regexp.html
function display(tpl_path,tpl_data){
	var tpl_root = "./template/";
	var tpl_path2 = tpl_root + tpl_path;
	var res = {};
	res.ret = true;
	res.text = "";
	res.content = "";

	try{
		res.content = fs.readFileSync(tpl_path2).toString();	
	}catch(e){
		res.ret = false;
		res.text = "模板读取错误:" + tpl_path2;
	}

	var pattern=new RegExp("^<%.*?%>");
	res.t = ' '+ res.content.match(pattern);
	var regx = /<%.*?%>/g;

	var tt ;
	var marks = [];//获得所有代码
	var marks_runable = [];//转化为真正可执行的代码
	marks_runable.push('var marks_codes=[]; ')  ; 
	marks_runable.push('function get(data){ ')  ; 
	var tti=0;//counter
	while( tt = regx.exec(res.content) ){
		marks.push(tt[0]);
		marks_runable.push('marks_codes.push("${'+tti+'}");')  ; 
		marks_runable.push(tt[0].replace('<%','').replace('%>',''))  ; 
		tti++;
	}
	//作用：返回结果
	marks_runable.push(" \n return marks_codes; \n}");

	//不断加入
	marks_runable.push(" function p(val){  marks_codes.push(val);  }");
	marks_runable.push(" exports.get=get;");

	console.log(marks_runable);

	fs.writeFile('t.js', marks_runable.join("\n"), function(err) {
			if (err) {
			return console.error(err);
			}
	});


	//获得所有html
	var htmls = res.content.split(regx);

	return res;
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
