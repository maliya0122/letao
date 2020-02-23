$(function(){

	mui.init({
		pullRefresh:{
		    container:"#refreshContainer",
		    down:{
		    	auto:true,
		    	callback:function(){
		    		setTimeout(function(){
		    			params={
		    				url: '/user/queryUserMessage',
							type: 'GET',
							dataType: 'json',
							data:'',
		    			}
		    			CT.ajaxlogin(params,function(data){
		    				//渲染页面
		    				var html=template('name',{comments:data});
		    				$('.mui-media').html(html);

		    				/*结束刷新状态*/
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
							//重置上拉加载功能
							mui('#refreshContainer').pullRefresh().refresh(true);
		    			})
		    		},1000)
				}
		    }
		}
	})

	$('#p20').on('tap',function(){
		$.ajax({
			url: '/user/logout',
			type: 'GET',
			dataType: 'json',
			data:'',
			success:function(data){
				location.href=CT.loginURL;
			}
		})

	})
})