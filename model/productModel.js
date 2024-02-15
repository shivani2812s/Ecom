const mongoose=require('mongoose')

const productSchema=mongoose.Schema({
    image:String,
    name: String,
    desc:String,
    price:Number
})

module.exports=mongoose.model('Products',productSchema);