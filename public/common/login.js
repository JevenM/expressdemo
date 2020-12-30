//创建Login对象：
function Login(container){
    //实例属性：
    this.container = container;
    this.init();
}

//登录模板
Login.template = `
<div class="login">
            <div class="logo">
                <img src="https://cas.1000phone.net/cas/images/login/logo.png">
            </div>
            <form class="form">
                <div class="form-group">
                    <label for="login_username">用户名</label>
                    <input type="email" class="form-control" id="login_username" placeholder="Email">
                </div>
                <div class="form-group">
                    <label for="login_password">密码</label>
                    <input type="password" class="form-control" id="login_password" placeholder="Password">
                </div>
                <div class="form-group">
                    <div class="alert alert-danger" role="alert">忘记密码?</div>
                    <div class="alert alert-info" role="alert" id="js_register">去注册</div>
                </div>
                <button type="button" class="btn btn-info login_btn" id="login_btn">登陆</button>
            </form>
        </div> 
`
//原型方法
Login.prototype = {
    init(){
        this.createDom();
        this.handlePush();
        this.loginBtn();
    },
    createDom:function(){
        this.el = $("<div class='content'></div>");
        this.el.append(Login.template);
        this.container.append(this.el);
    },
    //点击去注册切换到注册页面
    handlePush(){
       this.el.find("#js_register").on("click",$.proxy(this.handleRegister,this))  
    },
    handleRegister(){
        new Page().createContent(false);
    },
    //给登录按钮添加点击事件：
    loginBtn(){
        this.el.find("#login_btn").on("click",$.proxy(this.handleLoginCallBack,this))
    },
    handleLoginCallBack(){
        //var一个userInfo对象
        var userInfo = {
            username:this.el.find("#login_username").val(),
            password:this.el.find("#login_password").val()
        }
        console.log(userInfo)
       //通过ajax将客户端的请求发送给服务端：并接受服务端返回的数据：
        $.ajax({
            type:"post",
            async: true,
            url:"/api/login",
            data:userInfo,
            dataType: "json",
            success:$.proxy(this.handleLoginSucc,this)
        })
    },
    //登录成功则跳转到详情页
    handleLoginSucc(data){
        if(data.message){
            alert(data.message)
            location.href="/api/detail"
        }
    }
}
// new Login();