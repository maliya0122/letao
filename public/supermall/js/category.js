$(function(){
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005,
        scrollY: true, //是否竖向滚动
        bounce: true,
        indicators: false
    });

    var firstdata = null;
    var seconddata = null;
    var id = null;

    //获取一级分类的数据
    getFirstData(function (data) { 
        firstdata = data.rows;
        id = data.rows[0].id;

        //模板引擎
        var html = template('first',{  comments : firstdata })
        $('.menu ul').html(html)

        //获取第二级数据
        getSecondData(id,function (data) { 
            seconddata = data.rows;

            //第二层
            var html = template('second',{  comments : seconddata })
            $('.list ul').html(html)
         })
     })


     //点击事件
     $('.menu ul').on('tap','a',function(){
        id=$(this).attr('data-id');
        console.log(id)

        $('.menu  ul li').removeClass('now');
        $(this).parent().addClass('now')

        getSecondData(id,function (data) { 
            seconddata = data.rows;

            //第二层
            var html = template('second',{  comments : seconddata })
            $('.list ul').html(html)
         })
     })
})


//第一级数据
var getFirstData = function(callback){
    $.ajax({
        type: "GET",
        url: "/category/queryTopCategory",
        dataType: "json",
        success: function(data){
            callback && callback(data)
        }
    })
} 

//第二级数据
var getSecondData = function (data,callback) { 
    $.ajax({
        type: "GET",
        url: "/category/querySecondCategory",
        data:{ "id" : data },
        dataType: "json",
        success: function(data){
            callback && callback(data)
        }
    })
 }

 //点击事件
