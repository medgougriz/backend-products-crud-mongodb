//import modules
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()
const Product = require('./modules/Products')
const PORT = process.env.PORT

const URL_MONGOOSE = process.env.URL_MONGOOSE
mongoose.connect(URL_MONGOOSE)
.then(()=>{
    console.log("connected to database successfully");
})
.catch((err)=>{
    console.log("error connecting to database",err);
})


//database

const app = express()

app.use(express.json())

app.use(morgan('combined'))
app.use(cors())

//GET ALL USRES
app.get('/api/users',async (req,res)=>{
    const products = await Product.find()
    res.json(products)
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

app.post('/api/products',(req,res)=>{
    const data = req.body
    Product.insertMany(data)
    .then(()=>{
        res.json({data:data.length})
    })
    .catch((err)=>{
        res.json(err)
    })
})

app.get('/api/products',(req,res)=>{
    Product.find()
    .then((data)=>{
        res.json(data)
    })
    .catch((err)=>{
        res.json(err)
    })
})

app.delete('/api/product/:id',(req,res)=>{
    const id = req.params.id
    const product = Product.findByIdAndDelete(id)
    .then((data)=>{
        res.json(data)
    })
    .catch((err)=>{
        res.json(err)
    })
})

app.put('/api/product/:id',(req,res)=>{
    const id = req.params.id
    const {name, price, description, photo} = req.body
    const product = Product.findByIdAndUpdate(id,{
        name:name,
        price:price,
        description:description,
        photo:photo
    },{new:true})
    .then((data)=>{
        res.json(data)
    })
    .catch((err)=>{
        res.json(err)
    })
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})