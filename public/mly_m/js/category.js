$(function(){
	//模板引擎：获得数据，创建模板，渲染数据
	// 1.渲染默认的数据，一级分类和二级默认数据
	getcateleftData(function(data){
		var html=template('temp_left',{comments:data.rows});
		$('.cate_left ul').html(html);
		var cateid=$('.cate_left ul li:first-child').find('a').attr('data-id');

		// 二级分类默认加载
		getcaterightData(cateid,callback);
	});

	//2.点击一级分类，切换加载二级分类
	$('.cate_left ul').on('tap','a',function(e){
		var id=$(this).attr('data-id');

		//当前选中的时候不去加载
		if($(this).parent().hasClass('now')){
			return false;
		}

		$('.cate_left ul li').removeClass('now');
		$(this).parent().addClass('now');

		getcaterightData(id,callback);
	})
})
// 一级分类数据
var getcateleftData=function(callback){
	$.ajax({
		url: '/category/queryTopCategory',
		type: 'GET',
		dataType: 'json',
		data:"",
		success:function(data){
			callback && callback(data);
		}
	})
}
// 二级分类数据
var getcaterightData=function(params,callback){
	$.ajax({
		url: '/category/querySecondCategory',
		type: 'GET',
		dataType: 'json',
		data: {id:params},
		success:function(data){
			callback && callback(data);
		}
	})
}

//二级分类渲染数据
var callback=function(data){
		var html=template('temp_right',{comments:data.rows});
		$('.cate_right ul').html(html);
	}