$(function(){
    // 一级分类渲染
    getCateData1(function(data){
        var html=template("firstTemplate",{comments:data.rows});
        $(".cate_left ul").html(html);
        var cateid=$(".cate_left ul li:first-child").find('a').attr('data-id');
        // console.log(data);
        
		// 二级分类默认加载
		getCateData2(cateid,callback);
    });

    // 二级分类渲染
    $('.cate_left ul').on('tap','a',function(e){
		var id=$(this).attr('data-id');
		//当前选中的时候不去加载
		if($(this).parent().hasClass('now')){
			return false;
		}
		$('.cate_left ul li').removeClass('now');
		$(this).parent().addClass('now');
		getCateData2(id,callback);
	});

});
var getCateData1=function(callback){
    $.ajax({
        url:"/category/queryTopCategory",
        type:"GET",
        data:"",
        dataType:"json",
        success:function(data){
            callback&&callback(data);
        }
    });
};
var getCateData2=function(params,callback){
    $.ajax({
        url:"/category/querySecondCategory",
        type:"GET",
        data: {id:params},
        dataType:"json",
        success:function(data){
            callback&&callback(data);
        }
    });
};
//二级分类渲染数据
var callback=function(data){
    var html=template('secondTemplate',{comments:data.rows});
    $('.cate_right ul').html(html);
}
