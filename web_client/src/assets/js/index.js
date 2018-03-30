
export default {
  name: 'hello',
  data () {
    return {
      lists:'',
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
      currentPage: "",
      data1:false,
      num:10,
      searchData:{},
      param:"",
      nameId:""
    }
  },
   created(){
        this.ind=0;
       this.axios({
        method:'GET',
          url:this.siteUrl + '?num='+10+'&current_page='+ 1
        })
          .then((response) =>{
            // console.log(response.data.datas)
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage=+response.data.current_page
        })
        .catch((error)=>{
            console.log(error)
        })

    setInterval(()=>{
         this.axios({
        method:'GET',
          url:this.siteUrl + '?num='+10+'&current_page='+ 1
        })
          .then((response) =>{
            // console.log(response)
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage= +response.data.current_page
        })
        .catch((error)=>{
            console.log(error)
        })

    },50000)
},
 methods: {
    changeBgc: function (index) {
      this.ind = index
      if(this.ind==0){
         this.axios({
        method:'GET',
          url:this.siteUrl+'?num=' + 10 + '&current_page=' + 1
        })
          .then((response) =>{
            // console.log(response.data.datas)
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage=+response.data.current_page
        })
        .catch((error)=>{
            console.log(error)
        })
      }else if(this.ind==1) {
         this.axios({
        method:'post',
          url:this.siteUrl+'/status?num=' + 10 + '&current_page=' + 1,
          data:{
            status:1
          }
        })
          .then((response) =>{
            // console.log(response.data.datas)
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage=+response.data.current_page
              this.param=2
        })
        .catch((error)=>{
            console.log(error)
        })

      }else if(this.ind==2) {
         this.axios({
        method:'post',
          url:this.siteUrl+'/status?num=' + 10 + '&current_page=' + 1,
          data:{
            status:2
          }
        })
          .then((response) =>{
            // console.log(response.data.datas)
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage=+response.data.current_page
              this.param=3
        })
        .catch((error)=>{
            console.log(error)
        })
      }
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
    closeShow:function(){
      this.seen5=false;
    },
    openShow:function(){
      this.seen5=true;
      console.log(this.nameId)

    },
     handleSizeChange(val2) {
        // console.log(`每页 ${val2} 条`);
        this.num=val2
        if(this.param==1){
          // console.log(this.searchData);
          // console.log(val2)
            this.axios({
        method:'post',
         url:this.siteUrl+'/search?num=' + val2 + '&current_page=' + 1,
         data:this.searchData
        })
          .then((response) =>{
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage=+response.data.current_page
        })
        .catch((error)=>{
            console.log(error)
        })

        }else if(this.param==2){
            this.axios({
                method:'post',
                 url:this.siteUrl+'/status?num=' + val2 + '&current_page=' + 1,
                  data:{
                    status:1
                  }
                })
                  .then((response) =>{
                      this.lists=response.data.datas
                      this.total= +response.data.count;
                      this.currentPage=+response.data.current_page
                })
                .catch((error)=>{
                    console.log(error)
                })

        }else if(this.param==3){
           this.axios({
                method:'post',
                 url:this.siteUrl+'/status?num=' + val2 + '&current_page=' + 1,
                  data:{
                    status:2
                  }
                })
                  .then((response) =>{
                      this.lists=response.data.datas
                      this.total= +response.data.count;
                      this.currentPage=+response.data.current_page
                })
                .catch((error)=>{
                    console.log(error)
                })
        }else {
            this.axios({
        method:'GET',
         url:this.siteUrl+'?num=' + val2 + '&current_page=' + 1
        })
          .then((response) =>{
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage=+response.data.current_page
        })
        .catch((error)=>{
            console.log(error)
        })
        }
          

      },
      handleCurrentChange(val) {
        // console.log(val)
        if(this.param==1){
          this.axios({
        method:'post',
          url:this.siteUrl+'/search?num=' + this.num + '&current_page=' + val,
           data:this.searchData
        })
          .then((response) =>{
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage=+response.data.current_page
        })
        .catch((error)=>{
            console.log(error)
        })
        }else if(this.param==2){
           this.axios({
              method:'post',
                url:this.siteUrl+'/status?num=' + this.num + '&current_page=' + val,
                 data:{
                    status:1
                  }
              })
                .then((response) =>{
                    this.lists=response.data.datas
                    this.total= +response.data.count;
                    this.currentPage=+response.data.current_page
              })
              .catch((error)=>{
                  console.log(error)
              })
        }else if(this.param==3){
            this.axios({
              method:'post',
                url:this.siteUrl+'/status?num=' + this.num + '&current_page=' + val,
                 data:{
                    status:2
                  }
              })
                .then((response) =>{
                    this.lists=response.data.datas
                    this.total= +response.data.count;
                    this.currentPage=+response.data.current_page
              })
              .catch((error)=>{
                  console.log(error)
              })
        }else {
          this.axios({
        method:'GET',
          url:this.siteUrl+'?num=' + this.num + '&current_page=' + val,
          data:this.searchData
        })
          .then((response) =>{
              this.lists=response.data.datas
              this.total= +response.data.count;
              this.currentPage=+response.data.current_page
        })
        .catch((error)=>{
            console.log(error)
        })
        }
        
      },
      submit:function(){
        // console.log("searchData",this.searchData)
        this.axios({
            method: 'post',
            url: this.siteUrl+'/search?num=' + 10 + '&current_page=' + 1,
            data:this.searchData
          })
        .then((res)=>{
          // console.log("res",res)
          this.lists=res.data.datas
              this.total= +res.data.count;
              this.currentPage=+res.data.current_page
              this.param=1;
        })
        .catch((err)=>{
          console.log("err",err)
        })
      }
  }
}