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

const emailConfig = {
    service: '', 
    auth: {
      user: '',
      pass: '',
    },
  };
  const transporter = nodemailer.createTransport(smtpTransport(emailConfig));

router.get('/index',viewindex.viewindex);

router.get('/',viewindex.viewHome);

router.get('/users',userController.viewUsers);

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
            res.status(201).json({ message: "product added successfully", product: newProduct });
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
const link=`http://localhost:3001/resetpassword/${user.id}/${token}`
console.log(link);
const mailOptions = {
    from: 'shivani.s@codestoresolutions.com',
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