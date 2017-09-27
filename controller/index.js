var index = {};


index.index = function (data){
	data.data = {};
	data.data.name = "chenxiang";
	data.data.title = "宇宙联合总裁";
	return data.tpl.display(data.tpl_path,data.data);
}


exports.index = index.index;
