const Users=require('../model/userModel');
const Products=require('../model/productModel');

const viewindex = async (req, res) => {
    try {
        const allusers = await Users.find();
        const allproducts=await Products.find();
        res.render('index', { user: allusers , product:allproducts});
    } catch (error) {
       console.log(error);
    }
};
const viewHome=(req,res)=>{
    const admin=req.session.admin;
    res.render('Home',{admin});
}
module.exports={viewindex,viewHome};