//公共js
//1.进度条：只要有ajax请求，就有进度条展示
//2.左侧菜单栏的显示和隐藏
//3.退出登录的模态框：因为是js加入的，绑定click事件，点击取消后，还是继续绑定着click事件，
//所以需要先解绑，再绑定


//1.进度条
//NProgress相关配置：
NProgress.configure({ showSpinner: false });//不显示转圈的环
$(window).ajaxStart(function() {
	//只要执行ajax，就会有进度条
	NProgress.start();
});
$(window).ajaxComplete(function() {
	//只要执行ajax，就结束进度条
	NProgress.done();
});


var loginURL='/myadmin/login.html';


//2.显示和隐藏 
/*3.二级菜单的显示和隐藏*/
$('.menu ul li').on('click',function(){
    var $this = $(this);
    var $child = $this.children(".child");
    $child.slideToggle();
});


var hide=false;
$('#ileft').on('click',function(){
	if(!hide){
		$('.left').hide();
		hide=true;
	}else{
		$('.left').show();
	}
	
})




//3.退出登录,模态框，就是确认退出弹框

var logoutModal='<div class="modal fade" id="logoutModal" tabindex="-1" role="dialog">'+
'			  <div class="modal-dialog" role="document">'+
'			    <div class="modal-content">'+
'			      <div class="modal-header">'+
'			        <button type="button" class="close" data-dismiss="modal"></button>'+
'			        <h4 class="modal-title" id="myModalLabel">温馨提示</h4>'+
'			      </div>'+
'			      <div class="modal-body">'+
'			       	 <p class="text-danger">您确定退出管理系统?</p>'+
'			      </div>'+
'			      <div class="modal-footer">'+
'			        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
'			        <button type="button" class="btn btn-primary">确定</button>'+
'			      </div>'+
'			    </div>'+
'			  </div>'+
'			</div>';

$('body').append(logoutModal);


$('.iright').on('click',function(){
	$('#logoutModal').show();
	$('.btn-primary').off('click').on('click',function(){
		$.ajax({
			url:'/employee/employeeLogout',
			type:'GET',
			dataType: 'json',
			data:'',
			success:function(data){
				if(data.error){
					console.log(data);
				}else{
					location.href=loginURL;
				}
			}
		});
	});
})





