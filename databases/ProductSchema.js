const  mongoose = require("mongoose");

const ProductSchema =  mongoose.Schema({
    name : { type : String ,  uppercase: true, required : true },
    price:  { type: Number, required: true },
    amount: { type: Number, required: true },
    total:  { type: Number, required: Boolean [true, false] },
    source: {type: String, required: Boolean [true, false] }
  });


  const ProductModel = mongoose.model('Products', ProductSchema);

  module.exports = ProductModel;