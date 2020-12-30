//创建一个Register对象：
function Register(container){
    this.container = container;
    this.init();
}

//Resgiter模板
Register.template = `
<div class="login">
            <div class="logo">
                <img src="https://cas.1000phone.net/cas/images/login/logo.png">
            </div>
            <form class="form">
                <div class="form-group">
                    <label for="register_username">用户名</label>
                    <input type="email" class="form-control" id="register_username" placeholder="Email">
                </div>
                <div class="form-group">
                    <label for="register_password">密码</label>
                    <input type="password" class="form-control" id="register_password" placeholder="Password">
                </div>
                <div class="form-group">
                    <div class="alert alert-danger" role="alert">忘记密码?</div>
                    <div class="alert alert-info" role="alert" id="js_login">去登陆</div>
                </div>
                <button type="button" class="btn btn-info login_btn" id="login_btn">注册</button>
            </form>
        </div> 
`

Register.prototype = {
    init:function(){
        this.createDom();
        this.handlePush();
        this.handleRegister();
    },
    //创建div，将Register.prototype追加到div中，再将div追加到页面中
    createDom:function(){
        this.el = $("<div class='content'></div>");
        this.el.append(Register.template);
        this.container.append(this.el);
    },
    //点击去登录，切换到登录页面
    handlePush(){
        this.el.find("#js_login").on("click",$.proxy(this.handleLogin,this))  
    },
    handleLogin(){
         new Page().createContent(true);
    },
     //点击去注册，切换到注册页面
    handleRegister(){
        this.el.find("#login_btn").on("click",$.proxy(this.handleRegisterBtn,this))
    },

    //给注册按钮添加点击事件：通过$.ajax向服务器发送请求，并将服务器处理的结果返回给客户端
    handleRegisterBtn(){
        //获取客户信息（用户名和密码）
       var username = this.el.find("#register_username").val();
       var password = this.el.find("#register_password").val();

       //var一个userInfo对象，存放用户名和密码：因为key和value一样，所以只写一个就可以了
    //    var userInfo = {
    //        username：username,
    //        password:password
    //    }
       var userInfo = {
           username,
           password
       }
      //向服务端发送请求：将客户传递的参数传递给服务端，服务端进行处理，判断用户名是否存在 
        $.ajax({
            type:"post",
            url:"/api/register",    //接口是由后端提供的，通过路由建立前后端之间的连接
            data:userInfo,    
            dataType:"json",
            success:$.proxy(this.handleRegisterSuccess,this)    //获取数据成功返回handleRegisterSuccess方法
        })
    },
    handleRegisterSuccess(data){
        if(data.message){
            alert(data.message);    
            //注册成功跳转到登录页面
            new Page().createContent(true);    
        }
    }
}