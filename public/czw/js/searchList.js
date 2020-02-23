$(function(){
    mui(".mui-scroll-wrapper").scroll({
        indicators: false
    });
    // 获取关键字 在搜索栏上显示
    var urlParams=tt.getParams();
    // console.log(params);
    var $input=$("input").val(urlParams.key || "");
    // console.log($input);

    getSearchData({
        proName:urlParams.key,
        page:1,
        pageSize:4
    },function(data){
        // console.log(data);
        var html=template("list",{comments:data.data});
        // console.log({comments:data.data})
        $(".tt_product").html(html);
        // console.log(html);
    });


// 排序功能
$(".tt_sort a").on("tap",function(){
    $(this).addClass("now").siblings().removeClass("now");
    // 无法与orderVal功能匹配
    // if($(this).find("span").hasClass("fa-angle-up")){
    //     return false
    // }else{
    //     $(this).siblings().find("span").removeClass("fa-angle-up");
    //     $(this).find("span").removeClass("fa-angle-down")
    //     $(this).siblings().find("span").removeClass("fa-angle-down");
    //     $(this).find("span").addClass("fa-angle-up");
    //     $(this).siblings().find("span").addClass("fa-angle-down");
    // }
    if(!$(this).hasClass("now")){
        $(this).hasClass("now").siblings().removeClass("now")
            .find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
    }else{
        if($(this).find("span").hasClass("fa-angle-down")){
            $(this).find("span").removeClass("fa-angle-down").addClass("fa-angle-up");
        }else{
            $(this).find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
        }
    }
    var order=$(this).attr("date-order");
    var orderVal=$(this).find("span").hasClass("fa-angle-up")?1:2;
    var params={
        proName:urlParams.key,
        page:1,
        pageSize:4
    };
    params[order]=orderVal;
    getSearchData(params,function(data){
        var html=template("list",{comments:data.data});
        $(".tt_product").html(html);
    });
});
// 下拉刷新
mui.init({
    pullRefresh : {
      container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        contentdown : "下拉可以刷新",
        contentrefresh : "正在刷新...",
        // auto: false,//可选,默认false.首次加载自动上拉刷新一次
        callback :function(){
            console.log('...')
            // var freshData=$(".tt_search input").val().trim();
            // if(!freshData){
            //     mui.toast("请输入你的欢喜...");
            //     // mui('#refreshContainer').pullRefresh().endPulldown();
            //     //该方法的作用是关闭“正在刷新”的样式提示，内容区域回滚顶部位置
            //     mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // }else{
            //     $(".tt_sort a").removeClass("now");
            //     if($(".tt_sort a span").hasClass("fa-angle-up")){
            //         $(".tt_sort a span").removeClass("fa-angle-up").addClass("fa-angle-down")
            //     };
            //     getSearchData({
            //         proName:freshData,
            //         page:1,
            //         pageSize:4
            //     },function(data){
            //         setTimeout(function(){
            //         var html=template("list",{comments:data.data});
            //         $(".tt_product").html(html);
            //         mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            //         mui('#refreshContainer').pullRefresh().refresh(true);
                    
            //         },1000)
            //     }); 
            // }
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
      up : {
            // contentrefresh : "正在加载...",
            // contentnomore:'没有更多数据了',
            callback:function(){
                window.page++;
                var freshData=$(".tt_search input").val().trim();
                if(!freshData){
                    mui.toast("请输入你的欢喜...");
                    mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                }else{
                    $(".tt_sort a").removeClass("now");
                    if($(".tt_sort a span").hasClass("fa-angle-up")){
                        $(".tt_sort a span").removeClass("fa-angle-up").addClass("fa-angle-down")
                    };
                    getSearchData({
                        proName:freshData,
                        page:window.page,
                        pageSize:4
                    },function(data){
                        setTimeout(function(){
                        var html=template("list",{comments:data.data});
                        $(".tt_product").append(html);
                        if(data.data.length){
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                        }
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                        
                        },1000)
                    }); 
                }
            }
      }
    }
  });
// 上拉加载

});
var getSearchData=function(params,callback){
    $.ajax({
        url:"/product/queryProduct",
        type:"get",
        data:params,
        dataType:"json",
        success:function(data){
            callback && callback(data);
            window.page=data.page;
        }
    });
};