const express = require('express')
const {User} = require("./utils/models")
var bodyParser = require('body-parser')

var path = require("path")
var ejs = require('ejs');
const jwt = require("jsonwebtoken")
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('.html', ejs.__express) // 设置视图引擎后缀，为.html
// 设置模板根目录
app.set('views', path.join(__dirname, 'views'));
// 设置默认的模板后缀为art
app.set('view engine', 'html');
// 私密，应该写在本地文件
const SECRET = "sjdsjfjdnfdskjnfkdf"

app.use('/public',express.static('public'));

app.use(express.json())
// 首页
app.get('/', async(req, res)=>{
    res.render("index.html")
})
app.get('/api/detail', async(req, res)=>{
    res.render("detail.html")
})
// 查询所有用户
app.get('/api/users', async(req, res)=>{
    const users = await User.find()
    res.send(users)
})
// 登录
app.post('/api/login', async(req, res)=>{
    console.log(req.body.username)
    const user = await User.findOne({
        username: req.body.username
    })
    if(!user) return res.status(422).send({
        message: "用户名不存在"
    })
    const isPasswordValid = require("bcrypt").compareSync(
        req.body.password,
        user.password
    )
    if(!isPasswordValid) return res.status(422).send({
        message: "密码错误"
    })
    // 生成token
    const token = jwt.sign({
        id: String(user._id) 
    }, SECRET,{'expiresIn':'1h'})
    //种cookie
    res.cookie("token",token)
    res.cookie("userInfo",req.body.username)
    res.send({
        user,
        token: token,
        message: "登录成功"
    })
})
// 注册
app.post('/api/register', async(req, res)=>{
    console.log(req.body)
    const user = await User.findOne({
        username: req.body.username
    })
    if(!user) {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password
        })
        res.json({
            message:"注册成功"
           })
    }else{
        res.status(422).send({message:"用户已存在"})
    }
})

// 中间件，相当于是一个请求之前的拦截验证
const auth = async (req, res, next)=>{
    const raw = String(req.headers.authorization).split(' ').pop()
    // 解密token
    const {id} = jwt.verify(raw, SECRET)
    // 这里应该做一个判断，如果查找id失败，就不存到req中也不执行next
    req.user = await User.findById(id)
    next();
}

// 用户资料
app.get("/api/profile", auth, async (req, res)=>{
    const users = req.user;
    if(users)
        res.send(req.user)
    else
        res.send({
            "message": "faild"
        })
})

app.listen(3001, ()=>{
    console.log('http://localhost:3001')
})