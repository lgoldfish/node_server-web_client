<template>
  <div class="hello" @click="closeShow">
  <div class="header">
    <img src="../assets/images/u91.png" alt="icon">
    <h1>定位引擎监控</h1>
    <span><div></div>Exit</span>
    <span> <i></i> xuefang.tao</span>
  </div>
  <div class="container">
  <div class="content">
  <div class="search" :class="{searchActive:isSearch}">
    状态：   <span v-for="(sta,index) in status" :class="{'active':ind === index}" @click="changeBgc(index,sta)">{{sta}}</span> 
    <form :class="{form:isform} "  @submit.prevent="submit">
    <label :class="{data1:data1}" for="data1" >数据发送端口号 ：</label> 
      <input type="text" id="data1" name="sink_port" v-model="searchData.sink_port" >
      <label for="data2" >名称: &nbsp</label>
      <input type="text" id="data2" name="name" v-model="searchData.name">

  <div class="isblock" v-if="seen">
      <div class="data3">
      <label for="data3">协议：&nbsp </label>
      <select name="deal" id="data3" v-model="searchData.protocol">
      <option>请选择</option>  
        <option v-for=" xieyi in xieyis" :value="xieyi">{{xieyi}}</option>
      </select>
       </div>
      <div class="data4"> 
        <label for="data4">算法 ： </label>
      <select name="arithmetic" id="data4" v-model="searchData.algorithm"> 
        <option >请选择</option>
        <option value="ble-location">ble-location</option>
        <option value="wifi-location">wifi-location</option>
        <option value="rssi-filter">rssi-filter</option>
        <option value="third-party">third-party</option>
      </select>
      </div>
      <div class="data5"> 
              <label for="data5">IP: &nbsp </label>
    <input type="text" id="data5" name="sink_host" v-model="searchData.sink_host" placeholder="请输入数据发送IP">
  </div>
</div>
        <div class="downmargin" :class="{downmarginActive:isDown,isDownt2:isDown2}"> 
      <button >搜索</button>
      <button type="reset"  @click="resetData" v-if="seen3" >重置</button>
      <span @click="toDown" v-if="seen4"> 展开 <img src="../assets/images/logo.png" alt="展开"></span>
      <span @click="uPper" class=" upper" v-if="seen2"> 收起 <img src="../assets/images/u297.png" alt="收起"></span>
      </div>
    </form>
  </div>
  <table >
  <tr>
       <th>名称</th>
       <th>MapId</th>
        <th>数据源IP</th>
        <th>接收端IP</th>
        <th>接收端端口号</th>
        <th>协议</th>
        <th>AP监控</th>
        <th>接收状态</th>
        <th>接收Mac数（5min）</th>
        <th>算法</th>
        <th>数据发送IP</th>
        <th>数据发送端口号</th>  
        <th>发送Mac数（5min）</th>
        <th>运行状态</th>
        <th>日志</th>
  </tr>
  <tr v-for="list in lists">
    <td :title="list.introduction" >{{list.name_ch}}</td>
    <td  style="display:none">{{list.name}}</td>
    <td>{{list.mapid}}</td>
    <td>{{list.source_host}}</td> 
    <td>{{list.received_host}}</td> 
    <td>{{list.received_port}}</td> 
    <td>{{list.protocol}}</td> 
    <td>{{list.ap_status}}</td> 
    <td v-if="list.received_client_count>0 && new Date().getTime() - list.timestamp < 360000"><span class="normal"> <span>●</span> 正常</span></td> 
    <td v-else><span class="abnormal"><span>●</span> 无数据</span></td> 
    <td>{{list.received_client_count}}</td> 
    <td>{{list.algorithm}}</td> 
    <td>{{list.sink_host}}</td> 
    <td>{{list.sink_port}}</td> 
    <td>{{list.send_client_count}}</td> 
    <td v-if="new Date().getTime() - list.timestamp < 360000"><span class="normal"><span>●</span> 正常</span></td> 
      <td v-else><span class="abnormal"><span>●</span> 异常</span></td> 
    <td>
    <router-link :to="{name:'LogMessage',params:{id:list.name}}" target="_blank"><button class="lookBlog">□记录</button></router-link>
      <button @click="(e) => {openShow(list.name, e)}" class="lookBlog">□日志</button>
    </td> 
  </tr>
</table>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="+currentPage"
      :page-sizes="[5,10, 15,20,]"
      :page-size="+num"
      layout="total, sizes, prev, pager, next, jumper"
      :total="+total">
    </el-pagination>
  </div>

  </div>   
  </div>
    <div class="rightShow" v-if="seen5" @click="openShow2">
      <div class="rightShowButton"> 
            <img src="../assets/images/u237.png" alt="!">
            <span>监控日志</span>
            <img @click="closeShow" src="../assets/images/u235.png" alt="close">
      </div>
      <div class="oneline"> </div>      
      <div class="rightShowList">
           <div v-for="list in linkStatus" >
                 <div v-if="list.code==0">
                <span ><img src="../assets/images/u250.png" alt="接通">[{{name}}定位引擎]接通 {{list.datetime}}</span>
                <br><p></p>
                </div>
              <div v-if="list.code==1">
              <span ><img src="../assets/images/u248.png" alt="异常">数据异常 &nbsp&nbsp{{list.datetime}}</span>
              <br><p></p>
              </div>
              <div v-if="list.code==2">
              <span ><img src="../assets/images/error.png" alt="异常">程序中断 &nbsp&nbsp {{list.datetime}}</span>
              <br><p></p>
              </div>
          </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      lists:[],
      status:["全部","异常","正常"],
      ind:'',
      seen:false,
      seen2:false,
      seen3:false,
      seen4:true,
      seen5:false,
      isSearch:false,
      isform:false,
      isDown:true,
      isDown2:false,
      total:"",
      currentPage:1,
      data1:false,
      num:10,
      searchData:{
      },
      param:"",
      linkStatus:"",
      name:"",xieyis:["Palmap", "Aercoscout","Huawei","Ruijie","Sundray","Uradio","Aruba","Zte","BleGateway","PalmapBle"]
    }
    
  },
   created(){
        this.ind=0;
        this.createdData=()=>{
          console.log("调用后台接口",new Date())
            this.axios({
              method:'POST',
                url:this.siteUrl + this.num+"/" + this.currentPage,
                data:{
                  "searchData":this.searchData,
                  "linkStatus":this.status[this.ind]
                }
              })
                .then((res) =>{
                  console.log("res",res.data.data[0])
                  var array=res.data.data
                // array.sort((x,y)=>{
                //   return x.received_port - y.received_port
                // })
                this.lists=array
                    this.total= +res.data.count;
                    // this.currentPage = +res.data.current_page
              })
              .catch((error)=>{
                  console.log(error)
              })
        }
      this.createdData()

    setInterval(()=>{
     this.createdData()

    },1000*60*5)
},
 methods: {
    changeBgc: function (index,sta) {
      this.ind=index;
      this.createdData()
    },
    toDown:function (){
      this.seen=true;
      this.seen2=true;
      this.seen3=true;
      this.seen4=false;
      this.isSearch=true;
      this.isDown=false;
      this.isDown2=true;
      this.isform=true;
      this.data1=true;
    },
    uPper:function(){
      this.seen=false;
      this.seen2=false;
      this.seen3=false;
      this.seen4=true;
      this.isSearch=false;
      this.isDown=true;
      this.isDown2=false;
      this.isform=false;
      this.data1=false;
    },
    closeShow:function(e){
      if ( e && e.stopPropagation ) 
         e.stopPropagation(); 
         else 
          window.event.cancelBubble = true; 
      this.seen5=false;
    },
    resetData:function(){
      this.searchData={}
    },
    // -------------------------------------------------------------------------
    openShow:function(name, e){
      console.log(name);
      if ( e && e.stopPropagation ) {
         e.stopPropagation(); 
         }else if(window.event) {
          window.event.cancelBubble = true;
          } 
      this.seen5=true;
      this.axios({
        method:"get",
        url:this.siteUrl+"linkstatus?name="+name
      })
      .then((res)=>{
        this.linkStatus=res.data
        this.name=name;
        console.log("666",res.data[0].datetime)
        var thistime=res.data[0].datetime
        console.log(new Date(thistime).toLocaleString())
      })
    },
    openShow2:function(e){
      if ( e && e.stopPropagation ) 
         e.stopPropagation(); 
         else 
          window.event.cancelBubble = true; 
         this.seen5=true;
    }
    ,
    // -------------------------------------------------------------------------
     handleSizeChange(val2) {
      this.num=val2
      this.createdData()
        setInterval(()=>{
           this.createdData()
        },1000*60*5)

      },
      handleCurrentChange(val) {
        this.currentPage=val
        this.createdData()
        setInterval(()=>{
           this.createdData()
        },1000*60*5)
      },
      submit:function(){
        console.log("searchData",this.searchData)
        this.createdData()
        setInterval(()=>{
           this.createdData()
        },1000*60*5)

  //       var newsearchdata=this.searchData
  //        for(var i in newsearchdata){
  //         console.log(newsearchdata[i])
  //         console.log(i)
  //       if(newsearchdata[i]==''){
  //           delete newsearchdata[i]
  //       }
  //   }
  // if(JSON.stringify(newsearchdata)!="{}"){
  // }
        
      }
  }
}
</script>
<style scoped>
@import "../assets/css/index.css"
</style>
