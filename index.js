//import modules
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()
const Product = require('./modules/Products')

const URL_MONGOOSE = process.env.URL_MONGOOSE
mongoose.connect(URL_MONGOOSE)
.then(()=>{
    console.log("connected to database successfully");
})
.catch((err)=>{
    console.log("error connecting to database",err);
})


//database
const db_users=[]

const PORT = process.env.PORT
const app = express()

app.use(express.json())

app.use(morgan('combined'))
app.use(cors())

//GET ALL USRES
app.get('/api/users',(req,res)=>{
    res.json(db_users)
})

//CREATE USER
app.post('/api/user',(req,res)=>{
    const {username, email, photo, password} = req.body
    const user = {id:db_users.length,username,email,photo,password}
    db_users.push(user)
    res.json(user)
})

app.post('/api/product',(req,res)=>{
    const {name, price, description, photo} = req.body
    const product = new Product()
    product.name = name
    product.price = price
    product.description = description
    product.photo = photo
    product.save()
    .then((data)=>{
        res.json(data)
    })
    .catch((err)=>{
        res.json(err)
    })
})
//GET ONE USER
app.get('/api/user/:id',(req,res)=>{
    const id = parseInt(req.params.id)
    const user = db_users.find(u => u.id === id)
    res.json(user)
})
//UPDATE USER
app.put('/api/user/:id',(req, res)=>{
    
    const id = parseInt(req.params.id)
    // methode 01
    // const {username, photo, email, password} = req.body
    //  const dbUser = db_users.find(u => u.id === id)
    // dbUser.username = username
    // dbUser.photo = photo
    // dbUser.email = email
    // dbUser.password = password
    
    // methode 02
    db_users[id] = {id, ...req.body}
    const dbUser = db_users.find(u => u.id === id)
    
    res.json(dbUser)
})
//DELETE USER
app.delete('/api/user/:id',(req,res)=>{
    const id  = parseInt(req.params.id)
    const deletedUser = db_users[id]
    db_users.splice(id, 1)
    res.json({message : "user deleted ssucessfully",data: deletedUser})
})








app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT} http://localhost:${PORT}`);
})