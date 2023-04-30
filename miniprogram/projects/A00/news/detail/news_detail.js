const dbxx =wx.cloud.database()
Page({
  // 
  data: {
    content:'',
    flag:false
   },
  onLoad(options) {
    console.log("点击了那篇文章的id",options.id)
    // db.collection("articles").get().then(res=>{
    //   console.log("获取的文章内容",res.data)
    // })
    var idxx="1"
    if(options.id=="a149808563a954d1002009f612d42e45"){
      idxx="fc8e64656430d85907b5e299619bfc71"
    }else if (options.id=="048381bc63a954d10013d1ee10a1738b"){
      idxx="91ccb7356430d8830002662f3fc39782"
    }else if (options.id=="b8e8f72263a96bab00176cb27e6e8814"){
      idxx ="b851fc496430f9ee0002e891013e4018"
    }else if(options.id=="c2d93a7563a9a35a00145e7a44911208"){
      idxx="fc8e64656431886907c0fe0644f8619e"
    }else if(options.id=="b69d28ac64317f7d000dba31604eb212"){
      idxx="066aae88643e526c0010a845006a2632"
    }else {
      idxx="b851fc496430f9ee0002e891013e4018"
    }
    if (idxx!="1"){
      dbxx.collection("articles").doc(idxx).get().then(res=>{
        console.log("获取的文章内容",res.data)
        this.setData({
          content:res.data,
          flag:true
        })
      })
    }

  },
   // 

   gotohuodong(e){
     console.log("我进入活动了 ")
     wx.navigateTo({
       url: '/projects/A00/meet/index/meet_index?id=1',
     })
   }
})