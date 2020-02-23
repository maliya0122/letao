$(function(){
	rendar();

	

})
var params={
        page:1,
        pageSize:5
    }

//1.获取二级分类数据
var getsecondData=function(callback){
	$.ajax({
		type:'GET',
		url:'/product/queryProductDetailList',
		data:params,
		dataType:'json',
		success:function(data){
			callback && callback(data);
		}
	})
};


//2.渲染页面和分页插件
var rendar=function(){
	getsecondData(function(data){
		var html=template('product',{comments:data});
		$('.table_data').html(html);

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
				params.page=page;//修改page参数
				rendar();//重新发送请求，渲染页面;
			}
		}
		$('#mypage').bootstrapPaginator(options);//页面上加上分页按钮
	})
};