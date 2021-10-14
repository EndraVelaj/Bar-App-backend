const express = require ("express");
const app = express();
const port= 8080;
const uri = "mongodb+srv://endra:endra@cluster0.gujrt.mongodb.net/bar_app?retryWrites=true&w=majority";
const cors = require('cors');
const mongoose = require("mongoose");
const userModel = require ("./databases/Userschema");
const ProductModel = require("./databases/ProductSchema");
require('dotenv').config()

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

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


app.post('/register-user', async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log( salt)
        console.log(hashedPassword)

        const userTable = new userModel ({ username : req.body.username, email : req.body.email, password : hashedPassword });

        userTable.save()
            .then((result)=>{
                console.log("result in backend-----",result);
                return res.json({ code: 200, message: "user data", result: result })
            })
    } catch {
        res.status(500).send()
    }
}); 


app.post('/login-user', async(req,res) =>{

    const checkUser = await userModel.findOne({email: req.body.email});
    if(checkUser == null) {
       return res.json({ code: 404, message: "user is not registered", result: null })
    }
    try {
       if (await bcrypt.compare(req.body.password, checkUser.password)) {
        const accessToken = jwt.sign({name:checkUser.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
        return res.json({ code: 200, message: 'Success!', token: accessToken })
       }
       else {
        return res.json({ code: 404, message: 'Wrong email/password!'})
         }
       } catch {
        return res.json({ code: 500, message: "An internal server error ", error: error })
    }
});
    


//    try{

//     console.log("login-user----" , req.body);
//     const checkUser = await userModel.findOne({email: req.body.email});

//     if (checkUser) {
//         const accessToken = jwt.sign({name:checkUser.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
//         res.json({ token: accessToken, result:  })
//     } else {
//         res.json({ code: 404, message: "user is not registered", result: null })
//     }
//    } catch(error){
//         console.log("error-----", error);
//      res.json({ code: 500, message: "un internal server error ", error: error })
//    }
// });



app.post("/save-product", (req, res) => {

    console.log("save-product-------",req.body)

    const product = new ProductModel({
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        total: req.body.total
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
