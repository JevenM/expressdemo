function Page() {
    //实例属性：
    this.container = $(".login_container");    //登录注册最外层div的class名
    this.flag = true;        //设置开关，在注册和登录之间实现跳转
    this.init();
   
}

//原型方法：
Page.prototype = {
    init:function(){
        this.createContent();
    },
    //渲染到页面的方法：需要在Register和Login之后调用：
    createContent:function(params=this.flag){     //判断有参数则直接登录，没有参数则注册传参
        this.container.html('')
        if(params){
           //new一个login对象（login.js）
            this.login =  new Login(this.container);
        }else{
           //new一个register对象（register.js）
            this.register = new Register(this.container);
        }
    }
}

new Page();