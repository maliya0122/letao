$(function(){
	//1.页面可以上下滑动，滑动插件
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});
	
	//需求：
	//1.页面初始化的时候，搜索数据在输入框显示
	var key=CT.getUrlData().key; //url中的key
	key=decodeURI(key);//utf-8格式转换成汉字
	$('.tb_search input').val(key);

	var sdata=null;

	//获取搜索框中的关键字
	var getsearchData=function(){
		sdata=$('.tb_search input').val().trim();//输入框的key
		if(!sdata){
			mui.toast("请输入搜索内容")
		}
		return sdata;
	}

	//刚开始的时候，使用的默认值
	window.params={
		proName:key,
		page:1,
		pageSize:4
	};

	
	//5.下拉刷新的时候，根据当前条件进行刷新；下拉刷新就会重置样式,重置排序;
	//6.上拉刷新的时候，加载下一页，没有数据的时候，就不加载了，提示：没有数据;
	mui.init({
		pullRefresh:{
		    container:"#refreshContainer",
		    down:{
		    	auto:true,
		    	callback:function(){
		    		getsearchData();//sdata
		    		window.params.page=1;//参数要置为1，不然上拉加载后，page=9,一直加
		    		window.params.proName=sdata;//搜索的关键字
		   			
		   			//callback:下拉刷新后要获取数据，把数据渲染到页面中
		    		getProData(window.params,function(data){
		    			setTimeout(function(){
		    				var html=template('temp',{comments:data.data});
							$('.nav_content').html(html);
							/*结束刷新状态*/
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
							//重置上拉加载功能
							mui('#refreshContainer').pullRefresh().refresh(true);
		    			},1000)
		    		});
		    	}
		    },
		    up:{
		    	contentrefresh: '正在加载...',
                contentnomore:'没有更多数据了',
                callback:function(){
                	window.params.page++;

                	//上拉加载，page++
                	getProData(window.params,function(data){
		    			setTimeout(function(){
		    				//若没有数据了，就不加载了,传入true；
		    				if(!data.data.length){
								mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
								return false;
							}
		    				var html=template('temp',{comments:data.data});
							$('.nav_content').append(html);
                        	mui('#refreshContainer').pullRefresh().endPullupToRefresh();
		    			},1000)
		    		});
                }
		    }
		}
		})


	//3.用户点击搜索的时候，根据新的关键字进行搜索，清除样式和排序;
	$('.tb_search a').on('tap',function(){
		$(".tb_nav li").removeClass('now');
		if($(".tb_nav li span").hasClass('fa-angle-up')){
			$(".tb_nav li span").removeClass('fa-angle-up').addClass('fa-angle-down')
		};

		getsearchData();
		window.params.proName=sdata;

		//调用pullRefresh()，有下拉刷新效果，然后进行后续数据的渲染
		mui('#refreshContainer').pullRefresh().pulldownLoading();
        
	})


	//4.点击排序的时候，根据排序的选项进行排序；默认是降序排列；
	$(".tb_nav li").on('tap',function(){
		var $this=$(this);
		var $span=$this.find('span');

		//样式的切换
		if($this.hasClass('now')){
			if($span.hasClass('fa-angle-down')){
				$span.removeClass('fa-angle-down').addClass('fa-angle-up');
			}else{
				$span.removeClass('fa-angle-up').addClass('fa-angle-down');
			}
		}else{
			$this.addClass('now').siblings('li').removeClass('now');
		}

		//排序功能，需要添加参数
		var datatype=$this.attr("data-type");
		var datanum=($span.hasClass('fa-angle-down'))?2:1;
		getsearchData();
		window.params[datatype]=datanum;

		//调用pullRefresh()，有上拉加载效果，然后进行后续数据的渲染
		mui('#refreshContainer').pullRefresh().pulldownLoading();
		
	});
});


//获取商品数据
var getProData=function(params,callback){
	$.ajax({
		url: '/product/queryProduct',
		type: 'GET',
		dataType: 'json',
		data:params,
		success:function(data){
			callback && callback(data);
		}
	});
}

	

		

