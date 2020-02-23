$(function(){
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});

	mui('.mui-slider').slider({
		interval:3000 //自动轮播周期，若为0则不自动播放，默认为0
	})
})