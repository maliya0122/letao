$(function(){
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});

	var cartarr=[];
	window.htmldata=null;

	//上拉/下拉刷新功能：每次上拉刷新都调用一次查询接口，显示最新的数据
	mui.init({
		pullRefresh:{
		    container:"#refreshContainer",
		    down:{
		    	auto:true,
		    	callback:function(){
		    		setTimeout(function(){
		    			params={
		    				url: '/cart/queryCart',
							type: 'GET',
							dataType: 'json',
							data:'',
		    			}
		    			CT.ajaxlogin(params,function(data){
		    				//渲染页面
		    				var html=template('tableli',{model:data});
		    				$('.tableul').html(html);
		    				$('#cartAmount').html(0);
		    				
		    				//保存值，后面用

		    				window.htmldata=data;
		    				
							for(var i=0;i<data.length;i++){
								cartarr.push(data[i].id);
							}

		    				/*结束刷新状态*/
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
							//重置上拉加载功能
							mui('#refreshContainer').pullRefresh().refresh(true);
		    			})
		    		},1000)
				}
		    },
		    up:{
		    	contentrefresh: '正在加载...',
                contentnomore:'没有更多数据了',
                callback:function(){
                	setTimeout(function(){
                		mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                	},1000)
		    	}
		    }
		}
	});

	//顶部的刷新按钮
	$('.icon_right').on('tap',function(){
		//调用pullRefresh()，有下拉刷新效果，然后进行后续数据的渲染
		mui('#refreshContainer').pullRefresh().pulldownLoading();
	});  

	//编辑功能:需要更新购物车数据，发送请求
	$('body').on('tap','.mui-btn-blue',function(){
		var li=$(this).parent().parent();
		var index=li.index();
		var id=li.attr('id');//购物车的id:0
		var dataid=CT.getdataByid(cartarr,id);//data的id:35
		
		//取到购物车接口的data值
		var hdata=CT.getdataByid(window.htmldata,index);

		//正则表达式，mui自己加了br空格，所以要替换掉
		var html=template('size',{model:hdata}).replace(/\n/g,' ');

		mui.confirm(html, '编辑商品', ['确定', '取消'], function(e) {
			var size=$(".p_size .btn_size.now").html();
			var num=$('.p_number input').val();
		    if (e.index == 0) {
		    	//发送ajax请求：更新购物车
		    	CT.ajaxlogin({
		    		url:'/cart/updateCart',
		    		type:'POST',
		    		dataType:'json',
		    		data:{
		    			id:dataid,
		    			num:num,
		    			size:size
		    		},
		    		success:function(data){
		    			callback&&callback(data);
		    		}
		    	},function(data){
		    		mui('#refreshContainer').pullRefresh().pulldownLoading();
		    		setTimeout(function(){
		    			mui.toast('更新成功');
		    		},1000)
		    	})
		    } else {
		    	//mui.swipeoutClose(li);
		    	mui('#refreshContainer').pullRefresh().pulldownLoading(); 
		    }
		})
	})
	//删除功能：需要删除该项商品，发送请求
	.on('tap','.mui-btn-red',function(){
		var li=$(this).parent().parent();
		var index=parseInt(li.attr('id'));//0
		var dataid=CT.getdataByid(cartarr,index);

		mui.confirm('确定删除这个商品？', '温馨提示', ['确定', '取消'], function(e) {
		    if (e.index == 0) {
		    	//样式的改变,数据库的改变
		    	li.remove();
		    	CT.ajaxlogin({
		    		url:'/cart/deleteCart',
		    		type:'GET',
		    		data:{id:dataid},
		    		dataType:'json',
		    		success:function(data){
		    			callback&&callback(data);
		    		}
		    	},function(){
		    		amountSum();
		    	});
		    } else {
		    	mui('#refreshContainer').pullRefresh().pulldownLoading();
		    }
		})
	})
	//编辑功能里面的功能：样式切换
	.on('tap',".p_size .btn_size",function(){
		$(this).addClass('now').siblings().removeClass('now');
	})
	//编辑功能里面的功能：num的校验
	.on('tap',".p_number span",function(){
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
	})
	//金额计算：checkbox每次选中都要计算
	.on('change','[type=checkbox]',function(){
		amountSum();
	});

	$('.cart_order').on('tap',function(){
		mui.toast('功能暂未实现！')
	})
	
});

var amountSum=function(){
	var $box=$('[type=checkbox]:checked').parent();//所有选中的都放在box数组里面
	var sum=0;
	$.each($box, function(index, item) {
		var $li=$(item);//把每个li转化成jq对象
		var index=parseInt($li.attr('id'));
		var hdata=CT.getdataByid(window.htmldata,index);
		var eachsum=hdata.price*hdata.num;//每一项的和
		console.log(hdata.price);
		console.log(hdata.num);
		console.log(eachsum);
		sum+=eachsum;
	});
	
	//99,9900,0
	//99.1,9910,0,
	//99.11,9911,1
	//向下取整是 9990,取余数10,余数是0,false
	var msum=Math.floor(sum*100);//9911
	var sum=Math.floor(sum*100)/100;
	if(msum%10){
		//向下取整:99.99001   99.99001*100=9999.001   9999/100=99.99;
		sum=sum;
	}else if(msum%100){
		sum=sum.toString()+'0';//99.1 --> 99.10
	}else{
		sum=sum.toString()+'.00';
	}
	$('#cartAmount').html(sum);
}


