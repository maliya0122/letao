$(function(){
	$.ajax({
		url:'/employee/checkRootLogin',
		type:'GET',
		dataType: 'json',
		data:'',
		success:function(data){
			if(data.error=='400'){
				location.href='../myadmin/login.html';
			}else{
				//
			}
		}
	});

	// 基于准备好的dom，初始化echarts实例
    var echarts1 = echarts.init(document.getElementById('echarts1'));
    var xdata=[];
    var ydata=[];

    var edata=[{
    	time:'一月',
    	num:'3030'
    },{
    	time:'二月',
    	num:'5050'
    },{
    	time:'三月',
    	num:'7060'
    },{
    	time:'四月',
    	num:'5008'
    },{
    	time:'五月',
    	num:'3001'
    }]

    $.each(edata,function(index,item){
    	xdata.push(item.time);
    	ydata.push(item.num);
    })

    // 指定图表的配置项和数据
    var option1 = {
    	title:{
    		text:'2019注册人数'
    	},
	    color: ['#3398DB'],
	    tooltip : {
	        //trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
            data:['人数']
        },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	            axisTick: {
                	alignWithLabel: true
            	}
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'人数',
	            type:'bar',
	            barWidth: '80%',
	            data:[10, 52, 200, 334, 390, 330, 220]
	        }
	    ]
    };

    option1.xAxis[0].data=xdata;
    option1.series[0].data=ydata;

    // 使用刚指定的配置项和数据显示图表。
    echarts1.setOption(option1);


    var echarts2 = echarts.init(document.getElementById('echarts2'));
    var option2 = {
	    title : {
	        text: '品牌入驻率',
	        subtext: '2019年12月',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
	        data: ['雅诗兰黛','兰蔻','SKII','欧莱雅','科颜氏']
	    },
	    series : [
	        {
	            name: '访问次数',
	            type: 'pie',
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[
	                {value:335, name:'雅诗兰黛'},
	                {value:310, name:'兰蔻'},
	                {value:234, name:'SKII'},
	                {value:135, name:'欧莱雅'},
	                {value:154, name:'科颜氏'}
	            ],
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};

	echarts2.setOption(option2);
})