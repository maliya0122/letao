var CT={};
//1.获取?后面的值，并转换成对象存储  url?key=1&name=kk;
CT.getUrlData=function(){
	var data={};
	var search=location.search;
	if(search){
		var arr=search.replace("?","").split("&");
		for(var i=0;i<arr.length;i++){
			var temparr=arr[i].split("=");
			data[temparr[0]]=temparr[1];
		}
	}
	return data;
}

CT.loginURL='/mly_m/login.html';
CT.cartURL="/mly_m/cart.html";
CT.userURL="/mly_m/user.html";


//2.判断登录的ajax，未登录就跳转到登录页面，已登录就执行callback
CT.ajaxlogin=function(params,callback){
	$.ajax({
		url: params.url || '#',
		type: params.type || 'GET',
		dataType: params.dataType || 'json',
		data:params.data,
		success:function(data){
			if(data && data.error == '400'){
				//登录成功后再跳转回原来的页面
                location.href=CT.loginURL+'?returnUrl='+location.href;
            }else{
				callback && callback(data);
			}
		},
		error:function(){
			mui.toast('服务器繁忙');
		}
	});
}

//3.string-->object
CT.stringToobject=function(data){
	var object={};
	var arr=data.split('&');
	arr.forEach(function(item,i){
		var temparr=arr[i].split('=');
		object[temparr[0]]=temparr[1];
	})
	return object;
}

//4.从arr里面取对应的值
CT.getdataByid=function(arr,id){
	var item=null;
	$.each(arr, function(index, value) {
		 if(id == index){
		 	item = value;
		 }
	});
	return item;
}