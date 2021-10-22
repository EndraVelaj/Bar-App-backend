
const  mongoose = require("mongoose");

const userSchema =  mongoose.Schema({
    username:  { type: String, required: true,  uppercase: true },
    email : { type : String , required : true , unique : true, trim:true},
    password:  { type: String, required: true, trim:true },
    role: { type: String, default:'user', enum: ['user', 'admin']},
    accessToken: {type: String}
  });


  const userModel = mongoose.model('User', userSchema);

  module.exports = userModel;