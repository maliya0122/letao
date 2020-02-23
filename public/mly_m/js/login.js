$(function(){
	
	$('.btn_login').on('tap',function(){

		var data=$('.form_box').serialize();
		var object=CT.stringToobject(data);//对象
		var url=window.location.search.replace("?returnUrl=","");//''或者returnURL

		if(!object.username){
			mui.toast("请输入用户名/号码");
			return false;
		}
		if(!object.password){
			mui.toast("请输入密码");
			return false;
		}

		getLoginData(object,function(data){
			if(data.error==403){
				mui.toast(data.message);
			}else if(data.success == true){
				if(url){
					location.href=url;
				}else{
					location.href=CT.userURL;
				}
			}
		})


		

		
	})
});

var getLoginData = function(data,callback){
    $.ajax({
        type:'post',
        url:'/user/login',
        data:data,
        dataType:'json',
        success:function(data){
            callback && callback(data);
        }
    });
}