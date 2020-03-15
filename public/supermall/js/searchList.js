$(function(){
    var params = {
        proName:1,
        page:1,
        pageSize:1
    }

    var list = null;

     mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            auto: true,//可选,默认false.首次加载自动上拉刷新一次
            callback :function () { 
                setTimeout(function () { 
                    
                    getData(params,function (data) { 
                        list = data.data;
                        console.log(list)
                     })

                    mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				    mui('#refreshContainer').pullRefresh().refresh(true);
                 },1000)
             } 
          },
          up:{
              callback:function () { 
                setTimeout(function () { 
                    params.page++;
                    getData(params,function (data) { 
                        list = data.data;
                        console.log(list)
                        if(!list.length){
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                        }else{
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                        }
                     })
                    
                 },1000)
               }
          }
        }
      });
    
})

var getData = function (params,callback) { 
    $.ajax({
        type: "GET",
        url: "/product/queryProduct",
        data:params,
        dataType: "json",
        success: function(data){
            callback && callback(data)
        }
    })
 }