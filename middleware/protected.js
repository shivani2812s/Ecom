const requireauth=(req,res)=>{
    if(!req.session.admin){
        res.redirect('/login');
    }
    next();
}
module.exports=requireauth;