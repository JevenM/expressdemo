function Job() {
    this.content = $(".content");
    this.init()
}

Job.template = `
<form>
                    <div class="form-group">
                        <label for="job_name">职位名称</label>
                        <input type="text" class="form-control" id="job_name" placeholder="请输入职位名称">
                    </div>
                    <div class="form-group">
                        <label for="job_price">薪资</label>
                        <input type="text" class="form-control" id="job_price" placeholder="薪资范围">
                    </div>
                    <div class="form-group">
                        <label for="job_ask">要求</label>
                        <input type="text" class="form-control" id="job_ask" placeholder="招聘要求">
                    </div>
                    <div class="form-group">
                        <label for="company_name">公司名称</label>
                        <input type="text" class="form-control" id="company_name" placeholder="请输入公司名称">
                    </div>
                    <div class="form-group">
                        <label for="logo">上传公司logo</label>
                        <input type="file" id="logo" multiple>
                    </div>
                    <button type="button" class="btn btn-default" id="js_jobBtn">提交</button>
                </form>
`

//原型对象
Job.prototype = {
    init(){
        this.createDom();
        this.JobClick();
    },
    //动态渲染到页面中：
    createDom(){
        this.el = $("<div class='from'></div>");
        this.el.append(Job.template);
        this.content.html(this.el)
    },
    //点击提交,上传数据：
    JobClick(){
        this.el.find("#js_jobBtn").on("click",$.proxy(this.handleJobCB,this))
    },
    handleJobCB(){
        //创建formData 模拟表单提交数据  兼容性问题    此处用模拟表单提交数据主要是因为要上传图片
        //获取要上传的数据：
        var formData = new FormData();
        var jobName = this.el.find("#job_name");
        var jobPrice = this.el.find("#job_price");
        var jobAsk = this.el.find("#job_ask");
        var companyName = this.el.find("#company_name");
        var logo = this.el.find("#logo");
        
      
        
        //append key val  key是服务端接收的key值
        formData.append("jobname",jobName.val());
        formData.append("jobprice",jobPrice.val());
        formData.append("jobask",jobAsk.val());
        formData.append("companyname",companyName.val());
        formData.append("companylogo",logo[0].files[0]);
       
       
//通过ajax将请求的数据发送给服务器：
        $.ajax({
            type:"post",
            url:"/job/addjob",
            data:formData,
            cache:false,    //不读取缓存中的结果 true的话会读缓存  其实post本身就不会读取缓存中的结果
            contentType:false,  //数据编码格式不使用jquery的方式 为了避免 JQuery 对其操作，从而失去分界符，而使服务器不能正常解析文件。
            processData:false,//默认情况下，通过data选项传递进来的数据，如果是一个对象(技术上讲只要不是字符串)，都会处理转化成
            //一个查询字符串，以配合默认内容类型 "application/x-www-form-urlencoded"。如果要发送 DOM 树信息或其它不希望转换的
            //信息，请设置为 false。
            success:$.proxy(this.handleSuccess,this)
        })
    },
    handleSuccess(data){
       if(data.message){
           alert("添加成功");
           new JobList();
       }
    }
}