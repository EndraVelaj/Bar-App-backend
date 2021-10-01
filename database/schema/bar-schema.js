const  mongoose = require("mongoose");

const productSchema =  mongoose.Schema({
  _id: {type: Int32Array},
    name:  { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    total:  { type: Number, required: true }
  });


  const productModel = mongoose.model('Product', productSchema);

  module.exports = productModel;