$(function(){
	//初始化页面
	rendar();

	//禁用/启用按钮点击事件
	$('body').on('click','.table_data button',function(){
		var id=$(this).attr('data-id');
		var name=$(this).attr('data-name');
		var isDelete=$(this).hasClass('btn-danger')?1:0;
		var is=$(this).hasClass('btn-danger')?0:1;

		if(isDelete){
			$('#myModal').find('.status').html('禁用');
		}else{
			$('#myModal').find('.status').html('启用');
		}

		$('#myModal').find('.name').html(name);

		$('#yes').on('click',function(){
			$.ajax({
				type:'POST',
				url:'/user/updateUser',
				data:{id:id,isDelete:is},
				dataType:'json',
				success:function(data){
					if(data.success){
						$('#myModal').modal('hide');//弹框消失
						rendar();
					}else{
						alert(data.message);
					}
				}
			})
		})
	});

});


var params={
		page:1,
		pageSize:5
}

var result=null;

//获取初始数据
var getuserData=function(callback){
	$.ajax({
		type:'GET',
		url:'/user/queryUser',
		data:params,
		dataType:'json',
		success:function(data){
			if(data.error==400){
				location.href="/myadmin/login.html";
				return false;
			}
			callback && callback(data);
		}
	})
};

//渲染页面
var rendar=function(){
	getuserData(function(data){
		var html=template('user',{comments:data});
		$('.table_data').html(html);
		result=data;

		//页面初始化渲染成功，设置分页插件
		var options={
			bootstrapMajorVersion : 3, //如果是bootstrap3版本需要加此标识，并且设置包含分页内容的DOM元素为UL,如果是bootstrap2版本，则DOM包含元素是DIV
			currentPage : data.page, //当前页数
			totalPages : Math.ceil(data.total/data.size), //总页数
			numberOfPages : 10,//最多显示几个分页按钮：百度的10个
			itemTexts: function (type, page, current) {//如下的代码是将页眉显示的中文显示我们自定义的中文。
               switch (type) {
	                 case "first": return "首页";
	                 case "prev": return "上一页";
	                 case "next": return "下一页";
	                 case "last": return "末页";
	                 case "page": return page;
                 }
             },
			onPageClicked:function(event, originalEvent, type, page) {//分页按钮点击事件
				params.page=page;//参数修改了
				rendar();//重新发送请求，渲染页面;
			}
		}

		$('#mypage').bootstrapPaginator(options);//页面上加上分页按钮
	})
};
