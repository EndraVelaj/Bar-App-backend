const  mongoose = require("mongoose");

const ProductSchema =  mongoose.Schema({
    name : { type : String , required : true },
    price:  { type: Number, required: true },
    amount: { type: Number, required: true },
    total:  { type: Number, required: true }
  });


  const ProductModel = mongoose.model('Products', ProductSchema);

  module.exports = ProductModel;