const mongoose=require('mongoose');
const Products = require('../model/productModel');
const { response } = require('express');

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Products.find();
        res.render('products', { product: allProducts });
    } catch (error) {
        console.log(response);
    }
};
const viewaddProduct=(req,res)=>{
    res.render('addProduct');
}
const removeProduct = async (req, res) => {
    try {
        const productId=req.params.id;
        console.log(productId);
        const deletedProduct = await Products.findOneAndDelete({ _id: productId });
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.render('products');
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in removing product' });
    }
};
const viewupdateProduct = async(req, res) => {
    const productId=req.params.id;
    const details=await Products.findById({_id:productId});
    console.log(details);
        if (!details) {
            console.log("No product found at this id");
            return res.status(404).json({ message: 'Product not found' });
        }
        res.render('updateProduct', {detail:details});
    };

    const updateProduct = async (req, res) => {
        try {
            const productId = req.params.id;
            const updatedDetails = req.body;
    
            const filter = { _id: productId };
    
            const updateProduct = await Products.findOneAndUpdate(filter, updatedDetails, { new: true });
    
            if (!updateProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.redirect('/products');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error updating product' });
        }
    };
    
    // const searchProduct = async (req, res) => {
    //     const keyword = req.body.keyword;
    //     try {
    //         const products = await Products.find({ $text: { $search: keyword } });
    //         res.status(200).json(products);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: "Internal Server Error" });
    //     }
    // }
    
module.exports = { getAllProducts,viewaddProduct ,removeProduct,viewupdateProduct,updateProduct};
