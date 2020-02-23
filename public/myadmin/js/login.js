$(function(){
	$('#form').bootstrapValidator({
		feedbackIcons: {/*input状态样式图片*/
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
         },
        fields: { 
            /*键名和input name值对应*/        
            username: {              
                validators: {                 
                    notEmpty: {                       
                        message: '用户名不能为空'                
                    },                                
                    regexp: {                     
                        regexp: /^[a-zA-Z0-9_]{1,10}$/,                       
                        message: '只能为字母数字，最短1，最长10！'                  
                    },
                    //自定义的规则
                    callback:{
                        message: '用户名不存在'
                    }
                    // remote: {//ajax验证。server result:{"valid",true or false} 向服务发送当前input name值，获得一个json数据。例表示正确：{"valid",true}  
                    //      url: 'exist2.do',//验证地址
                    //      message: '用户已存在',//提示消息
                    //      delay :  2000,//每输入一个字符，就发ajax请求，服务器压力还是太大，设置2秒发送一次ajax（默认输入一个字符，提交一次，服务器压力太大）
                    //      type: 'POST'//请求方式
                    //      *自定义提交数据，默认值提交当前input value
                    //       *  data: function(validator) {
                    //            return {
                    //                password: $('[name="passwordNameAttributeInYourForm"]').val(),
                    //                whatever: $('[name="whateverNameAttributeInYourForm"]').val()
                    //            };
                    //         }    
                    //  },             
                }          
            },         
            password: {              
                validators: {                 
                    notEmpty: {                       
                        message: '密码不能为空！'                
                    }, 
                    stringLength:{                     
                        min:"4",                         
                        max:"10",                        
                        message:"最短为4,最长为10"                    
                    },                 
                    regexp: {                     
                        regexp: /^[a-zA-Z0-9_]{1,20}$/,                       
                        message: '只能为字母数字，最短1，最长20！'                  
                    },
                    callback:{
                        message: '密码错误'
                    }                         
                }
            }    
        }
	})
    //校验成功才触发
    .on('success.form.bv', function(e) {      
        e.preventDefault(); //阻止默认事件,点submit会跳到action，跳一下 
        //console.log(e.target); //form表单的dom元素
        var $form=$(e.target);
        //console.log($form);//jq对象
        //console.log($form.serialize());//username=1&password=1234

        var formdata=$form.data('bootstrapValidator');
        console.log(formdata);//校验对象
        //ajax校验
          $.ajax({
            url:'/employee/employeeLogin',
            type:'POST',
            data:$form.serialize(),//string或者object
            dataType:'json',
            success:function(data){
                //业务成功
                if(data.success==true){
                    location.href='/myadmin/index.html';
                }else{
                   //业务失败
                   if(data.error==1000){
                    //用户不存在
                    //更改校验的状态的函数：校验的表单name，改成什么状态，使用哪个校验规则
                    //状态值：INVALID，VALIDATING，VALID，NOT_VALIDATED
                    formdata.updateStatus('username','INVALID','callback');
                   }else if(data.error==1001){
                    //密码错误
                    formdata.updateStatus('password','INVALID','callback');
                   } 
                }
                
            }

          })  
        
    });
})