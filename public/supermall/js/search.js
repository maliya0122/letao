$(function(){
    var data = null;
    $('.search input').val('');
    var list = JSON.parse(localStorage.getItem('list') || '[]')
    //console.log(list)

    //渲染数据
    var html = template('list',{comments : list});
    $('.list').html(html)


    $('#btn').click(function () { 
        data =$.trim($('.search input').val());
        if(!data){
            return false;
        }else{
            list.push(data)

            localStorage.setItem('list',JSON.stringify(list))

            //链接跳转
             window.location.href = './searchList.html' + '?key=' + data;
        }
        
     })

     $('.clear').click(function () { 
        localStorage.clear()
        var list = JSON.parse(localStorage.getItem('list') || '[]')
        var html = template('list',{comments : list});
        $('.list').html(html)
      })

      $('body').on('click','li span',function(){
            var value = $(this).parent().find('.value')[0].innerText
            var index = list.findIndex(item=>{
                return item  == value
            })
            list.splice(index,1)
            localStorage.setItem('list',JSON.stringify(list))
            var html = template('list',{comments : list});
            $('.list').html(html)
      })

      $('body').on('click','li',function(){
        var value = $(this).find('.value')[0].innerText
        window.location.href = './searchList.html' + '?key=' + value;
      })


})