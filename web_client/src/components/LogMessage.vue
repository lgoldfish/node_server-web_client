<template>
	<div class="logMessage">
	<div class="header">
    <img src="../assets/images/u91.png" alt="icon">
    <h1>定位引擎监控</h1>
    <span><div></div>Exit</span>
    <span> <i></i> xuefang.tao</span>
  </div>
  <div class="container">
  <p class="ProjectTitle">项目名称：{{this.$route.params.id}}</p>
  <div class="content Statistical_table">
		<div class="dateMac">
			  <div class="block">
			    <el-date-picker
			      v-model="value1"
			      type="date"
			      placeholder="选择日期"
			      @change="otherDay"
			      :picker-options="pickerOptions0">
			    </el-date-picker>
			  </div>
  			<div id="main"></div>
		</div>
		<div class="offLink">
			<div class="block">
			  <el-date-picker
			    v-model="value3"
			    type="month"
			    @change="otherError"
			    placeholder="选择月">
			  </el-date-picker>
			</div>
			<div id="main3" ></div>	
		</div>
			<div class="monthMac">
			<div class="block">
			  <el-date-picker
			    v-model="value2"
			    type="month"
			    @change="otherMonth"
			    placeholder="选择月">
			  </el-date-picker>
			</div>			
			<div id="main2" ></div>
		</div>	
  </div>	
  </div>
	</div>
</template>
<script>
	// import echarts from 'echarts';
	export default  {
		data(){
			return{
				dataId:"",
				pickerOptions0: {
		          disabledDate(time) {
		            return time.getTime() > Date.now() - 360000;
		         	 }
		          },				     
		        value1:new Date(),
		        value2: new Date(),
		        value3: new Date(),
		        dayMac:""
			}
		},
		created(){
			document.title=this.$route.params.id
			this.distribute=(array,dateFormat)=>{
				var date=[], input=[],output=[];
				for(let i=0 ; i<array.length ; i ++ ){
					if(dateFormat=="day"){
						date.push(new Date(array[i].date).getHours()+":00")
					}
					if(dateFormat=="month"){
						date.push(new Date(array[i].date).getDate() +"号")
					}
					input.push(array[i].received_client_count)
					output.push(array[i].output_client_count)
				}
				return {
					date,
					input,
					output
				}
			}
			
		},
		methods:{
			otherDay:function(date){
				this.value1=date
				this.goSearchDay()

			},
			otherMonth:function(date){
				this.value2=date
				this.goSearchMonth()
			},
			otherError:function(date){
				this.value3=date
				this.goSearchError()
			}
		},
		mounted(){
			this.goSearchDay=()=>{
				this.axios({
				url:this.siteUrl+"daylog/"+this.$route.params.id,
				params:{
					date:this.value1
				},
				method:"get"
				})
				.then((res)=>{
					console.log("day",res.data)
					this.dayMac=this.distribute(res.data,"day")
					this.renderDay(this.dayMac.date,this.dayMac.input,this.dayMac.output)
				})
				.catch((err)=>{
					console.log(err)
				})	
			}
			this.goSearchMonth=()=>{
				this.axios({
					url:this.siteUrl+"monthlog/"+this.$route.params.id,
					params:{
						date:this.value2
					},
					method:"get"
				})
				.then((res)=>{
					this.dayMac=this.distribute(res.data,"month")
					console.log("month",this.dayMac)
					this.renderMonth(this.dayMac.date,this.dayMac.input,this.dayMac.output)
				})
				.catch((err)=>{
					console.log(err)
				})	
			}
				this.goSearchError=()=>{
				this.axios({
					url:this.siteUrl+"errorlog/"+this.$route.params.id,
					params:{
						date:this.value3
					},
					method:"get"
				})
				.then((res)=>{
					console.log("error",res.data)
					this.blurData=res.data
					this.renderError()
				})
				.catch((err)=>{
					console.log(err)
				})	
			}
			this.goSearchDay()
			this.goSearchMonth()
			this.goSearchError()
			this.renderDay=(date,input,output)=>{
			var myChart = echarts.init(document.getElementById('main'))
			var option = {
				    title: {
				        text: '日Mac吞吐趋势'
				    },
				    tooltip: {
				        trigger: 'axis'
				    },
				    legend: {
				        data:['input','output']
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    toolbox: {
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data:date
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: [
				        {
				            name:'input',
				            type:'line',
				            stack: '总量',
				            data:input
				        },
				        {
				            name:'output',
				            type:'line',
				            stack: '总量',
				            data:output
				        }
				    ]
				};
				myChart.setOption(option);
			}
			this.renderMonth=(date,input,output)=>{
				var myChart2 = echarts.init(document.getElementById('main2'))
				var option2 = {
					    title: {
					        text: '月Mac吞吐趋势'
					    },
					    tooltip: {
					        trigger: 'axis'
					    },
					    legend: {
					        data:['input','output']
					    },
					    grid: {
					        left: '3%',
					        right: '4%',
					        bottom: '3%',
					        containLabel: true
					    },
					    toolbox: {
					        feature: {
					            saveAsImage: {}
					        }
					    },
					    xAxis: {
					        type: 'category',
					        boundaryGap: false,
					        data:date
					    },
					    yAxis: {
					        type: 'value'
					    },
					    series: [
					        {
					            name:'input',
					            type:'line',
					            stack: '总量',
					            data:input
					        },
					        {
					            name:'output',
					            type:'line',
					            stack: '总量',
					            data:output
					        }
					    ]
				};
				myChart2.setOption(option2);
			}
			this.renderError=()=>{
			var myChart3 = echarts.init(document.getElementById('main3'))
			var cellSize = [80, 80];
			var pieRadius = 30;
			console.log("this.value3",this.value3)
			function timeFormat( params ){
				var year = new Date(params).getFullYear()
				var month = new Date(params).getMonth()+1
				var month2 = new Date(params).getMonth()+2
				var startDate=year+ "-"+month+"-"+"01"
				var endDate=year+"-"+month2+"-"+"01"
				var monthRange=year+"-"+month
				return {startDate,endDate,monthRange};
			}
			var rangeDate=timeFormat(this.value3)

			function getVirtulData() {
			    var date = +echarts.number.parseDate(rangeDate.startDate);
			    var end = +echarts.number.parseDate(rangeDate.endDate);
			    var dayTime = 3600 * 24 * 1000;
			    var data = [];
			    for (var time = date; time < end; time += dayTime) {
			        data.push([
			            echarts.format.formatTime('yyyy-MM-dd', time),
			            Math.floor(Math.random() * 10000)
			        ]);
			    }
			    return data;
			}
			var blurData=this.blurData
		console.log("blurData:",blurData)
		function getPieSeries(scatterData, chart) {

		    return echarts.util.map(scatterData, function (item, index) {
		        var center = chart.convertToPixel('calendar', item);
		        return {
		            id: index + 'pie',
		            type: 'pie',
		            center: center,
		            label: {
		                normal: {
		                    formatter: '{c}',
		                    position: 'inside'
		                }
		            },
		            radius: pieRadius,
		            data: [
		                {name: '程序中断', value:blurData[index][1]},
		                {name: '数据异常', value:blurData[index][0]}
		            ]
		        };
		    });
		}

		function getPieSeriesUpdate(scatterData, chart) {
		    return echarts.util.map(scatterData, function (item, index) {
		        var center = chart.convertToPixel('calendar', item);
		        return {
		            id: index + 'pie',
		            center: center
		        };
		    });
		}

		var scatterData = getVirtulData();

			var option3 = {
				title:{
    				  text:"异常监控统计"
   					 },
			    tooltip : {},
			    legend: {
			        data: ['程序中断', '数据异常'],
			        bottom: 20
			    },
			    calendar: {
			        top: 'middle',
			        left: 'center',
			        orient: 'vertical',
			        cellSize: cellSize,
			        yearLabel: {
			            show: false,
			            textStyle: {
			                fontSize: 30
			            }
			        },
			        dayLabel: {
			            margin: 10,
			            firstDay: 1,
			            nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			            show:true
			        },
			        monthLabel: {
			            show: true
			        },
			        range: [rangeDate.monthRange]
			    },
			    series: [{
			        id: 'label',
			        type: 'scatter',
			        coordinateSystem: 'calendar',
			        symbolSize: 1,
			        label: {
			            normal: {
			                show: true,
			                formatter: function (params) {
			                    return echarts.format.formatTime('dd', params.value[0]);
			                },
			                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
			                textStyle: {
			                    color: '#000',
			                    fontSize: 14
			                }
			            }
			        },
			        data: scatterData
			    }]
			};

		if (!app.inNode) {
		    var pieInitialized;
		    setTimeout(function () {
		        pieInitialized = true;
		        myChart3.setOption({
		            series: getPieSeries(scatterData, myChart3)
		        });
		    }, 10);

		    app.onresize = function () {
		        if (pieInitialized) {
		            myChart3.setOption({
		                series: getPieSeriesUpdate(scatterData, myChart3)
		            });
		        }
		    };
		}
		myChart3.setOption(option3);

		}
	}
}
</script>
<style scoped>
@import "../assets/css/logMessage.css"
</style>