const express = require('express');
const mongoose=require('mongoose')
const router = express.Router();
const jwt=require('jsonwebtoken');
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const productController=require('../controller/productController');
const viewindex=require('../controller/viewindex');
const userController=require('../controller/userController');
const adminController=require('../controller/adminController');
const Products=require('../model/productModel');
const Admin = require('../model/adminModel');



const JWT_SECRET='xyz';

router.get('/index',viewindex.viewindex);

router.get('/',viewindex.viewHome);

router.get('/users',userController.viewUsers);

router.get('/signup',userController.viewsignup)

router.get('/login',userController.viewlogin);

router.post('/login',adminController.adminLogin);

router.get('/logout',adminController.adminLogout);

router.get('/products',productController.getAllProducts);

router.get('/addproduct',productController.viewaddProduct);

router.post('/addproduct',async (req, res) => {
        try {
            console.log(req.body);
            const { name, image, desc, price } = req.body;
            const newProduct = new Products({
                name,
                image,
                desc,
                price,
            });
            await newProduct.save();
            res.redirect('/products');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error adding new product' });
        }
    });
router.get('/removeProduct/:id',productController.removeProduct);

router.get('/updateproduct/:id',productController.viewupdateProduct);

router.post('/updateProduct/:id',productController.updateProduct);

router.get('/forgotpassword',adminController.forgotpassword);

router.post('/forgotpassword',async(req,res,next)=>{
    const{email}=req.body;
    const user = await Admin.findOne({ email });
    if(!user){
        res.send('Admin not registerd');
        return;
    }
const secret=JWT_SECRET+user.password;
const payload={
    email:user.email,
    id:user.id
}
const token=jwt.sign(payload,secret,{expiresIn:'15m'})
const link=`http://localhost:3001/forgotpassword/${user.id}/${token}`
console.log(link);

nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ricky.schumm99@ethereal.email',
        pass: 'U1wYQqwhgPdz13N6s3'
    }
});
const mailOptions = {
    from: '"Shivani" <shivanisingh36813@gmail.com>',
    to: email,
    subject: 'Reset Password',
    text: `Click the following link to reset your password: ${link}`,
    html: `<p>Click the following link to reset your password:</p><a href="${link}">${link}</a>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send reset password link.');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Reset password link sent successfully.');
  });
});
router.get('/forgotpassword/:id/:token',(req,res,next)=>{

   const{id,token}=req.params;
   const user= Admin.findOne({ _id:id });
    res.render('resetpassword',{email:user.email});
})
router.post('/forgotpassword/:id/:token',(req,res,next)=>{
    const{id,token}=req.params;
    const{password,password2}=req.body;
    const user= Admin.findOne({ _id:id });
    const secret=JWT_SECRET+user.password;
       if(password==password2){
        Admin.updateOne(
            { _id: id }, 
            { $set: { password: password2 } } 
         )
         res.render('login');
       }
       else{
       alert('password do not match');
       res.render('resetpassword');
       }
})
router.get('/search', async (req, res) => {
  try {
      const { name } = req.query;
      const query = {};
      if (name) {
          query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search for name
      }
      await Products.find(query).exec()
      .then(docs=>{
          const response={
              count: docs.length,
              products:docs.map(
                  doc=>{
                      return{
                          id:doc._id,
                          name:doc.name,
                          price:doc.price,
                          image:doc.image,
                          desc:doc.desc,
                      }
                  }
              )
          }
          res.json(response);
      });
  } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/resetpassword/:id/:token',(req,res)=>{
    const {id,token}=req.body;
});
router.post('/resetpassword');

module.exports = router;