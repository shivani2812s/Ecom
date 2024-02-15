const Users=require('../model/userModel');
const viewlogin=(req,res)=>{
    res.render('login');
}
const viewsignup=(req,res)=>{
    res.render('signup');
}

const viewUsers = async (req, res) => {
    try {
        const allusers = await Users.find();
        res.render('users', { user: allusers });
    } catch (error) {
       console.log(error);
    }
};

module.exports={viewlogin,viewsignup,viewUsers};
