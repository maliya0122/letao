$(function(){
	//初始化页面
	rendar();
	
	$('#form').bootstrapValidator({
		feedbackIcons: {/*input状态样式图片*/
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
         },
         fields:{
         	categoryName:{
         		validators:{
         			notEmpty: {                       
                        message: '分类名称不能为空'                
                    }
         		}
         	}
         }
    })
    .on('success.form.bv', function(e) {
    	e.preventDefault(); 
    	var $form=$(e.target);
    	var formdata=$form.data('bootstrapValidator');
    	$.ajax({
            url:'/category/addTopCategory',
            type:'POST',
            data:$form.serialize(),
            dataType:'json',
            success:function(data){
            	if(data.success ==true){
            		$('#myModal').modal('hide');//弹框消失
            		rendar();
            	}else{
            		alert(data.message);
            	}
            }
        })
    });


    $('[data-dismiss="modal"]').on('click',function(){
    	params.page=1;
    	rendar();
    	//重置模态框数据
    	$('[name="categoryName"]').val('');//把数据清空
        $('#form').data('bootstrapValidator').resetForm();
    })



});


var params={
	page:1,
	pageSize:4
}

var result=null;

//获取初始数据
var getfirstData=function(callback){
	$.ajax({
		type:'GET',
		url:'/category/queryTopCategoryPaging',
		data:params,
		dataType:'json',
		success:function(data){
			callback && callback(data);
		}
	})
};

//渲染页面
var rendar=function(){
	getfirstData(function(data){
		var html=template('cate1',{comments:data});
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
				params.page=page;//参数修改了
				rendar();//重新发送请求，渲染页面;
			}
		}

		$('#mypage').bootstrapPaginator(options);//页面上加上分页按钮
	})
};
