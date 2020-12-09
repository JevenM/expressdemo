const express = require('express')
const {User} = require("./models")
const jwt = require("jsonwebtoken")
const app = express()
// 私密，应该写在本地文件
const SECRET = "sjdsjfjdnfdskjnfkdf"

app.use(express.json())
// 首页
app.get('/', async(req, res)=>{
    res.send('ok')
})
// 查询所有用户
app.get('/api/users', async(req, res)=>{
    const users = await User.find()
    res.send(users)
})
// 登录
app.post('/api/login', async(req, res)=>{
    console.log(req.body)
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
        message: "密码无效"
    })
    // 生成token
    const token = jwt.sign({
        id: String(user._id) 
    }, SECRET)
    res.send({
        user,
        token: token
    })
})
// 注册
app.post('/api/register', async(req, res)=>{
    console.log(req.body)
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    res.send(user)
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
    res.send(req.user)
})

app.listen(3001, ()=>{
    console.log('http://localhost:3001')
})