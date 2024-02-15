const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    username:String,
    email: String,
    password:String,
    token:String
})

module.exports=mongoose.model('Users',userSchema);