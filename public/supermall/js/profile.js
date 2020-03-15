$(function () { 
    
    $.ajax({
        type: "GET",
        url: "/user/queryUserMessage",
        dataType: "json",
        success: function(data){
            if(data&&data.error == 400){
                window.location.href = './login.html' + '?returnUrl=' + window.location.href;
            }else{
                console.log('登录状态')
            }
        }
    })
 })