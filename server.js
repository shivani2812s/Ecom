
const express = require('express');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');


const app = express();
const port = 3001;
const session = require('express-session');
const path = require('path');
const hbs = require('hbs');
const bodyParser=require('body-parser');
const router = require('./router/route');
const nodemailer = require("nodemailer");
const staticPath = path.join(__dirname, "./static");
const viewPath = path.join(__dirname, "./views");
const layoutPath = path.join(__dirname, "./views/layout");
app.set('views', viewPath);
app.set('view engine', 'hbs');
app.use(express.static(staticPath));
hbs.registerPartials(layoutPath);
const ProductData=require('./data');
const adminData=require('./admin');
const users=require('./users');
const Products=require('./model/productModel');
const Users=require('./model/userModel');
const Admin=require('./model/adminModel');
app.use(express.json()); 

app.use(session({
    secret: 'ecom',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const DB = 'mongodb+srv://shivanis:LGnKDLqr8AK1z50M@cluster0.bddbnlp.mongodb.net/ecommerse?retryWrites=true&w=majority';
mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => {
    console.log('Connection successful');
}).catch((err) => {
    console.error('Connection failed:', err.message);
});

// Admin.insertMany(adminData).then(()=>{
//   console.log("admin stored sucessfully");
//   mongoose.connection.close();
// }).catch((error)=>{
//   console.log(error);
//   mongoose.connection.close();
// })
// Users.insertMany(users).then(()=>{
//     console.log("user stored sucessfully");
//     mongoose.connection.close();
//   }).catch((error)=>{
//     console.log(error);
//     mongoose.connection.close();
//   })
//   Products.insertMany(ProductData).then(()=>{
//     console.log("product stored sucessfully");
//     mongoose.connection.close();
//   }).catch((error)=>{
//     console.log(error);
//     mongoose.connection.close();
//   })

app.use('/',router);

app.listen(port, () => {
    console.log("Server running on port", port);
});