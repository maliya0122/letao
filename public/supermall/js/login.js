$(function () { 
    
    $('.btn').click(function(){
        var name = $('.name').val()
        var pass = $('.pass').val()
        console.log(name)
        console.log(pass)

        $.ajax({
            type: "POST",
            url: "/user/login",
            dataType: "json",
            data:{
                username : name,
                password : pass
            },
            success: function(data){
                if(data.success){
                    window.location.href = './profile.html'
                }else{
                    console.log(data.message)
                }
            }
        })

    })

 })