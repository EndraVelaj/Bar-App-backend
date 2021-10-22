const express = require("express");
const app = express();
const port = 8080;
const uri = "mongodb+srv://endra:endra@cluster0.gujrt.mongodb.net/bar_app?retryWrites=true&w=majority";
const cors = require('cors');
const mongoose = require("mongoose");
const userModel = require("./databases/Userschema");
const ProductModel = require("./databases/ProductSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config()

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to DB!');
    })
    .catch((error) => {
        console.log("not connected-------", error)
    });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.post('/register-user', async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt)
        console.log(hashedPassword)
        const role = req.body.role;

        const newUser = new userModel({ username: req.body.username, email: req.body.email, password: hashedPassword, role: role && 'user' });
        const adminUser = new userModel({ username: req.body.username, email: req.body.email, password: hashedPassword, role: role && 'admin' });

        const adminToken = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

        if (req.body.email=== "admin@gmail.com" && hashedPassword === "admin") {

            adminUser.adminToken = adminUser;
            await adminUser.save();
            res.json({
                data: adminUser,
                adminToken
            })

        } else {
            newUser.accessToken = accessToken;
            await newUser.save();
            res.json({
                data: newUser,
                accessToken
            })
        }

        // newUser.accessToken = accessToken;
        // await newUser.save();
        // res.json({
        //     data: newUser,
        //     accessToken
        // })
        // newUser.save()
        //     .then((result)=>{
        //         console.log("result in backend-----",result);
        //         return res.json({ code: 200, message: "user data", result: result })
        //     })

    } catch (error) {
        // res.status(500).send()
        next(error)
    }
});

app.put('/user', function (req, res) {
    res.send('Got a PUT request')
});


app.delete('/delete-user/:id', async (req, res,) => {
    try {
        const userData = await userModel.findByIdAndRemove(req.params.id);
        if (userData)
            return res.send( userData )
        else
            return res.send({error: 'no data!'})

    } catch (error) {
        return res.json({ message: error })
    }
});

app.get("/get-users", async (req, res) => {
    userModel.find({_username : 'admin'})
        .then((result) => {
            const normal_users = result.filter((user) => { return user.username !== "admin" });
            return res.json({ code: 200, message: 'These are the users--', result: normal_users })
        }).catch((error) => {
            return res.json({ code: 500, message: 'Error happened...', error: error });
        })
});


app.post('/login-user', async (req, res, next) => {

    const checkUser = await userModel.findOne({ email: req.body.email });
    const role = req.body.role;
    if (checkUser == null) {
        return res.json({ code: 404, message: "user is not registered", result: null })
    }
    try {

        if (await bcrypt.compare(req.body.password, checkUser.password)) {
            const adminToken = jwt.sign({ checkUserId: checkUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            const userToken = jwt.sign({ checkUserId: checkUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

            // if (accessToken.expiresIn) {
            //     return res.redirect('/');
            // }
            const adminUser = new userModel({ username: req.body.username, email: req.body.email, role: role || 'admin' });
            const loginUser = new userModel({ username: req.body.username, email: req.body.email, role: role || 'user' });

            if (req.body.email === "admin@gmail.com" && req.body.password === "admin") {

                return res.status(200).json({
                    message: "This is admin user",
                    data: { adminUser },
                    adminToken
                })
            } else {
                return res.status(200).json({
                    message: "This is normal user",
                    data: { loginUser },
                    userToken
                })
            }
        }
        else {
            return res.json({ code: 404, message: 'Wrong email/password!' })
        }

    } catch (error) {
        next(error);
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    return res.redirect('/');
});

app.post("/save-product", (req, res) => {

    console.log("save-product-------", req.body)

    const product = new ProductModel({
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        total: req.body.total,
        source: req.body.source
    });

    product.save()
        .then((result) => {
            return res.json({ code: 200, message: "Product is succesfully added to db.", result: result })
        })
        .catch((error) => {
            return res.json({ code: 500, message: "Internal server error.", error: error })
        })
});

app.delete('/delete-product/:id', async (req, res,) => {
    try {
        const productData = await ProductModel.findByIdAndRemove(req.params.id);
        if (productData)
            return res.send( productData )
        else
            return res.send({error: 'no data!'})

    } catch (error) {
        return res.json({ message: error })
    }
})

app.get("/get-products", async (req, res) => {
    ProductModel.find()
        .then((result) => {
            return res.json({ code: 200, message: 'These are the products--', result: result })
        }).catch((error) => {
            return res.json({ code: 500, message: 'Error happened...', error: error });
        })
})

app.listen(port, () => {
    console.log(` server is running on port ${port}`);
});
