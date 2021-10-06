
const  mongoose = require("mongoose");

const userSchema =  mongoose.Schema({
    username:  { type: String, required: true },
    email : { type : String , required : true , unique : true},
    password:  { type: String, required: true },
    isAdmin : { type : Number, required : false ,default : 1 }
  });


  const userModel = mongoose.model('User', userSchema);

  module.exports = userModel;