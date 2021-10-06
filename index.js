const express = require ("express");
const app = express();
const router = require("./router");
const port= 8080;
const uri = "mongodb+srv://endra:endra@cluster0.zqqz7.mongodb.net/bar-app-2?retryWrites=true&w=majority";
const cors = require('cors');
const mongoose = require("mongoose");
const userModel = require ("./databases/Userschema");
const ProductModel = require("./databases/ProductSchema");

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('connected to DB!');
})
.catch((error) => { 
    console.log("not connected-------",error)
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.get('/save-user', (req, res) => {
//     res.sendFile();
//   });

app.post('/register-user', (req, res) => {
    const userTable = new userModel({
         username : req.body.username,
         email : req.body.email,
         password : req.body.password,
         isAdmin : req.body.isAdmin
    });

    userTable.save()
    .then((result)=>{
        console.log("result in backend-----",result);
        return res.json({ code: 200, message: "user data", result: result })
    })
    .catch((error)=>{
        return res.json({ code: 500, message: "un error has ocurred", error: error })
    })
  });

app.post('/login-user', async(req,res) =>{

    console.log("login-user----" , req.body);
    const checkUser = await userModel.findOne({email: req.body.email});

   // console.log("checkUser----" , checkUser);

    //checkUser = checkUser ? checkUser : null;
    if(checkUser){
        console.log("checkUser-----",checkUser);
        return res.json({ code: 200, message: "user is registered", result: checkUser }) 

    } else {
        return res.json({ code: 404, message: "user is not registered", result: null })
    }

});

app.post("/save-product", (req, res) => {

    console.log("save-product-------",req.body)

    const product = new ProductModel({
        name: req.body.p_name,
        price: req.body.p_price,
        amount: req.body.p_amount,
        total: req.body.p_total
    });

    product.save()
    .then((result) => {
        return res.json({ code: 200, message: "Product is succesfully added to db.", result: result })
    })
    .catch((error)=>{
        return res.json({ code: 500, message: "Internal server error.", error: error })
    })
});

app.get("/get-products", async (req, res) => {
    ProductModel.find() 
    .then((result) => {
        return res.json({ code:200, message:'These are the products--', result: result})
    }).catch((error) => {
        return res.json({ code:500, message:'Error happened...', error: error });
    })
})

app.listen(port , ()=> {
    console.log(` server is running on port ${port}`);
});
