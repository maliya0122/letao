window.tt={};
tt.getParams=function(){
    // 获取key值 转换为对象
    var params={};
    var search=location.search;
    if(search){
        search=search.replace("?","");
        var arr=search.split("&");
        arr.forEach(function(item,i){
            var itemArr=item.split("=")
            params[itemArr[0]]=itemArr[1];
        });
    };
    return params
};