$(function(){
	//页面可以上下滑动
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});
	
	//需求：
	//1.页面初始化的时候，数据在输入框显示
	var key=CT.getUrlData().key;//url中的key
	$('.tb_search input').val(key);
	
	//2.页面初始化的时候，根据url的key进行渲染
	// getProData({
	// 	proName:key,
	// 	page:1,
	// 	pageSize:4
	// },renderData);

	//3.用户点击搜索的时候，根据新的关键字进行搜索，清除样式和排序

	//5.下拉刷新的时候，根据当前条件进行刷新；下拉刷新就会重置样式,重置排序;
	//6.上拉刷新的时候，加载下一页，没有数据的时候，就不加载了，提示：没有数据;
	mui.init({
		  	pullRefresh:{
		    container:"#refreshContainer",
		    down:{
		      auto: true,
		      callback:function(){
		      	var sdata=$('.tb_search input').val().trim();//输入框的key
				if(!sdata){
					mui.toast('请输入搜索内容');
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				}else{
					//下拉刷新的时候，要重置样式，重置数据
					$(".tb_nav li").removeClass('now');
					if($(".tb_nav li span").hasClass('fa-angle-up')){
						$(".tb_nav li span").removeClass('fa-angle-up').addClass('fa-angle-down')
					};
					getProData({
						proName:sdata,
						page:1,
						pageSize:4
					},function(data){
						setTimeout(function(){
							var html=template('temp',{comments:data.data});
							$('.nav_content').html(html);
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
							mui('#refreshContainer').pullRefresh().refresh(true);
						},1000)
					});
				}
				}
			},
			up:{
				callback:function(){
					window.page++;
					var datatype=$(".tb_nav li.now").attr("data-type");
					var datanum=($(".tb_nav li.now").find('span').hasClass('fa-angle-down'))?2:1;
					var sdata=$('.tb_search input').val().trim();//输入框的key
					if(!sdata){
						mui.toast('请输入搜索内容');
						mui('#refreshContainer').pullRefresh().endPullupToRefresh();
					}
					params={
						proName:sdata,
						page:window.page,
						pageSize:4
					}
					params[datatype]=datanum;
					getProData(params,function(data){
						setTimeout(function(){
							var html=template('temp',{comments:data.data});
							$('.nav_content').append(html);
							if(data.data.length){
								mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
							}
							mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
						},1000)
					});
				}
			}
		}
		});

	$('.tb_search a').on('tap',function(){
		var sdata=$('.tb_search input').val().trim();//输入框的key
		if(!sdata){
			mui.toast("请输入搜索内容")
		}
		$(".tb_nav li").removeClass('now');
			if($(".tb_nav li span").hasClass('fa-angle-up')){
				$(".tb_nav li span").removeClass('fa-angle-up').addClass('fa-angle-down')
		};
		getProData({
			proName:sdata,
			page:1,
			pageSize:4
		},renderData);

		mui('#refreshContainer').pullRefresh().pulldownLoading();
	});

	//4.点击排序的时候，根据排序的选项进行排序；默认是降序排列；
	$(".tb_nav li").on('tap',function(){
		var $this=$(this);
		var $span=$this.find('span');

		//1.样式的改变
		if($this.hasClass('now')){
			if($span.hasClass('fa-angle-down')){
				$span.removeClass('fa-angle-down').addClass('fa-angle-up');
			}else{
				$span.removeClass('fa-angle-up').addClass('fa-angle-down');
			}
		}else{
			$this.addClass('now').siblings('li').removeClass('now');
		}

		//2.数据的排序
		var datatype=$this.attr("data-type");
		var datanum=($span.hasClass('fa-angle-down'))?2:1;

		var sdata=$('.tb_search input').val().trim();//输入框的key
		if(sdata){
			params={
				proName:sdata,
				page:1,
				pageSize:4
			}
			params[datatype]=datanum;
			getProData(params,renderData);
		}else{
			mui.toast('请输入搜索内容');
		}

		mui('#refreshContainer').pullRefresh().pulldownLoading();
	});

});

//渲染页面
var renderData=function(data){
	var html=template('temp',{comments:data.data});
	$('.nav_content').html(html);
}

//获取商品数据
var getProData=function(params,callback){
	$.ajax({
		url: '/product/queryProduct',
		type: 'GET',
		dataType: 'json',
		data:params,
		success:function(data){
			callback && callback(data);
			window.page=data.page;
		}
	});
}

	

		

