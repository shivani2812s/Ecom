const Admin=require('../model/adminModel');
const User=require('../model/userModel');
const adminLogin= async (req, res) => {
    try {
        const { email,password } = req.body;
        const admin=await Admin.findOne({email,password});
        if(admin){
            req.session.admin=admin;
            res.redirect('/');
        }
        else{
            const user=await User.findOne({email,password})
            res.render('Home',{user:user});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'error logging admin'});
    }
}
const adminLogout=async (req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/');
        }
    })
}
const forgotpassword=(req,res)=>{
    res.render('forgotpassword');
}
module.exports={adminLogin,adminLogout,forgotpassword};