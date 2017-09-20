var index = {};
index.run = function(action, get){
	try{
		return index.index(get);
	}catch(e){
		return "error run()";
	}
}



index.index = function (get){
	return "hiiiiiiiiiiiiiiiiiiiii";
}


exports.run = index.run;
