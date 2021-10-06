const express = require("express");
const userModel = require ("./databases/Userschema");
const router = express.Router();

router.post("/save-user", (req, res) => {

    const user = new userModel({
        username: req.body.username,
        password: req.body.username
    });

    user.save().then((result) => {
        return res.json({ code:200, message: "Successful", result: result })
    })

});