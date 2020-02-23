$(function(){
	//需求：
	//

	//根据页面缓存渲染默认数据
	$('.tb_search input').val("");
	renderData();

	//点击搜索按钮跳转
	$('.tb_search a').on('tap',function(){
		var key=$('.tb_search input').val().trim();

		if(!key){
			mui.toast('请输入搜索内容')
		}else{
			location.href="searchList.html?key="+key;
			//添加搜索记录
			addhisData(key);
		}
	});

	//清空搜索历史
	$('body').on('tap','.historybox .right',function(){
		window.localStorage.removeItem("searchH");
		renderData();
	}).on('tap','.inputbox span',function(e){
		var delkey=$(this).prev().val();
		deleteData(delkey);
		renderData();
	});

	//点击搜索历史进行跳转
	$('body').on('tap','.inputbox input',function(e){
		var delkey=$(this).val();
		location.href="searchList.html?key="+delkey;
	})

})


//页面渲染数据
var renderData=function(){
	var html=template('teminit',{comments:gethisData()})
	$('.tb_history').html(html);
}

//获取搜索记录
var gethisData=function(){
	return JSON.parse(window.localStorage.getItem("searchH") || '[]');
}

//添加搜索记录
var addhisData=function(key){
	var arr=gethisData();
	$.each(arr,function(i,value){
		if(key == value){
			arr.splice(i,1);
		}
	})
	arr.push(key);
	window.localStorage.setItem('searchH',JSON.stringify(arr));
}

//删除某个搜索记录
var deleteData=function(key){
	var arr=gethisData();
	$.each(arr,function(i,value){
		if(key == value){
			arr.splice(i,1);
			window.localStorage.setItem('searchH',JSON.stringify(arr));
		}
	})
	
}