const express = require("express");
const app = express();
const router = require("./router/router");
const port = 8080;
const uri = require("./database/index");
const cors = require('cors');
const mongoose = require("mongoose");

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('connected to DB!');
})
.catch((error) => { 
    console.log(error)
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/",(req,res,next)=>{
    console.log("hi there");
    next();
});

app.use("/test-api2",(req,res,next)=>{
    console.log("Hello world, this is my first api!");
    next();
});

app.use("/",router);

app.listen(port , ()=> {
    console.log(` server is running on port ${port}`);
});