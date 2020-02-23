$(function(){

    // 需求：
    // 1.分页显示页面数据，点击分页按钮可以跳转到对应页面
    // 2.添加分类：
    // 2.1.模态框数据的渲染
    // 2.2.数据加上校验正确/错误的提示，后面加上input(隐藏/透明)，name是接口需要的参数
    // 2.3.数据校验，数据校验成功，加上对应的状态
    // 2.4.发送请求成功后，重置模态框数据
    // 2.5.点击模态框的取消按钮，也要重置模态框数据

    //页面数据渲染成功
    rendar();
    rendarfirst();

	//1.categoryId
   $('body').on('click','#choose li',function(){
   		var text=$(this).text();
   		var id=$(this).attr('data-id');
   		var html=text + ' <span class="caret"></span>';
   		$('#btn').html(html);//下拉框的数据就是选择的数据了
   		$('[name="categoryId"]').val(id);//第一个下拉框的数据categoryId

   		/*数据校验成功，显示合法的提示*/
        $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
   });

   //2.上传图片,brandLogo
   fileupload();

   //3.表单校验
   $('#form').bootstrapValidator({
		feedbackIcons: {/*input状态样式图片*/
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
         },
        excluded:[],//加上这个，hidden，disable类型的input都会校验
        fields: {       
            categoryId: {              
                validators: {                 
                    notEmpty: {                       
                        message: '请选择一级分类'                
                    }                                       
                }          
            },         
            brandName: {              
                validators: {                 
                    notEmpty: {                       
                        message: '二级分类名称不能为空'                
                    }                
                }
            },
            brandLogo:{
            	validators: {                 
                    notEmpty: {                       
                        message: '请上传图片'                
                    }                
                }
            }    
        }
	})
    .on('success.form.bv', function(e) {   

        e.preventDefault(); //阻止默认事件,点submit会跳到action，跳一下 

        var $form=$(e.target);
        console.log($form);//form#form.bv-form

        var formdata=$form.data('bootstrapValidator');
        console.log(formdata);//bootstrapValidator校验对象

        //发送ajax请求
          $.ajax({
            url:'/category/addSecondCategory',
            type:'POST',
            data:$form.serialize(),//string或者object
            dataType:'json',
            success:function(data){
                if(data.success==true){
                	$('#myModal_add').modal('hide');
                	params.page=1;
                	rendar();

                    console.log($form[0]);//form的dom元素

                	//重置模态框数据
                	$form[0].reset();//数据全部清空
                    $form.data('bootstrapValidator').resetForm();//校验的状态清空
                    $('#btn').html('请选择  <span class="caret"></span>');
                    $form.find('#uploadimg').attr('src','images/none.png');
                }
            }
          })  
      })


    //4.点击取消，重置模态框
    $('[data-dismiss="modal"]').on('click',function(){
    	params.page=1;
    	rendar();

    	//重置模态框数据
    	$('#form')[0].reset();//DOM的表单元素重置参数：reset()
        $('#form').data('bootstrapValidator').resetForm();
        // $('#btn').html('请选择  <span class="caret"></span>');
        // $('#form').find('#uploadimg').attr('src','images/none.png');
    })

});


//全局变量
var params={
        page:1,
        pageSize:5
    }


//1.获取二级分类数据
var getsecondData=function(callback){
	$.ajax({
		type:'GET',
		url:'/category/querySecondCategoryPaging',
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
		var html=template('cate2',{comments:data});
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


//3.获取一级分类的数据
var getfirstData=function(callback){
	$.ajax({
		type:'GET',
		url:'/category/queryTopCategoryPaging',
		data:{page:1,pageSize:1000},
		dataType:'json',
		success:function(data){
			callback && callback(data);
		}
	})
};


//4.渲染模态框的下拉选择数据
var rendarfirst=function(){
	getfirstData(function(data){
		var html=template('dropdown-menu',{comments:data});
		$('#choose').html(html);
	})
}


//5.上传图片
var fileupload=function(){
    //上传文件的input改变时
	$('#uploadfile').change(function(){
            var file=this.files[0];
            $filePath=URL.createObjectURL(file);//获取当前文件的一个内存URL
            $('#uploadimg').attr('src',$filePath);

            /*显示合法的提示*/
        	$('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');

            if($filePath){
            	$('[name="brandLogo"]').val('/mobile/images/brand6.png');
            }
            
    });
}