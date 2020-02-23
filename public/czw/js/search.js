$(function(){
    $(".tt_search a").on("tap",function(){
        var key=$.trim($(".tt_search input").val());
        if(!key){
            mui.toast("请输入你的欢喜...");
        }else{
            location.href="searchList.html?key="+key;
        }
        
    });
});