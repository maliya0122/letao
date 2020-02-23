$(function(){
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});

	getproductdata(function(data){
		$('.loading').remove();
		var html=template('temp',{model:data});
		$('.mui-srcoll').html(html);

		mui('.mui-slider').slider({
			interval:1000 //自动轮播周期，若为0则不自动播放，默认为0
		});
	});

	//切换尺码
	$("body").on('tap',".p_size .btn_size",function(){
		$(this).addClass('now').siblings().removeClass('now');
	});

	//加减数量
	$("body").on('tap',".p_number span",function(){
		var num=$(".p_number input").val();
		//字符串转数字
		var max=parseInt($(".p_number input").attr('data-max'));

		if($(this).hasClass('jian')){
			if(num<=0){
				mui.toast('没有库存了~');
			}else{
				num--;
			}
		}else{
			if(num>=max){
				//遇到击穿(tap的问题toast被覆盖了，冒泡的原理)，就用延时处理;
				mui.toast("超过库存了~");
			}else{
				num++;
			}
		}
		$(".p_number input").val(num);
	});

	//加入购物车
	//判断尺码和数量,判断登录
	$('.btn_addCart').on('tap',function(){
		var id=CT.getUrlData().id;
		var size=$('.p_size .btn_size.now').html();
		var num=$(".p_number input").val();
		if(size==null){
			mui.toast("请选择尺码");
			return false;
		};
		if(num<=0){
				mui.toast("请选择数量");
				return false;
		};

		//跳转到购物车页面，判断是否登录
		var data={
				productId:id,
				num:num,
				size:size
		};
		CT.ajaxlogin({
				url: '/cart/addCart',
				type: 'POST',
				dataType: 'json',
				data:data,
			},function(){
				mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function(e) {
		            if (e.index == 0) {
		                location.href = CT.cartURL;
		            } else {
		                //TODO
		            }
		        })
		    });	
		});
	});




var productid=CT.getUrlData().id;

var getproductdata=function(callback){
	$.ajax({
		url: '/product/queryProductDetail',
		type: 'GET',
		dataType: 'json',
		data:{id:productid},
		success:function(data){
			setTimeout(function(){
				callback && callback(data);
			},1000);
		}
	});
}