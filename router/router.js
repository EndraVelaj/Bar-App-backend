const express = require("express");
const productModel = require("../database/schema/bar-schema");
const router = express.Router();

router.get("/test-api", (req, res) => {
    return res.json({ code: 200, message: "all seams good" });
});

router.post("/save-product", (req, res) => {
    //console.log("result--of api-----",req.body);
    const product = new productModel({
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        total: req.body.total
    });

    product.save().then((result) => {
        //console.log("save api is OK-----",result);
        return res.json({ code: 200, message: "all seams good", result: result })
    })

});


router.get("/getAll", async (req, res) => {
    productModel.find({}, "-_id")
        .then((result) => {
            console.log("result------", result.length)
            if (result.length === 0) {
                return res.json({ code: 206, message: 'Hey it looks like the table is empty', result: result })
            } else {
                return res.json({ code: 200, message: 'Hey i have found this data', result: result })
            }
        }).catch((error) => {
            console.log("error------", error);
            return res.json({ code: 500, message: 'Un error server happened', error: error });
        })

    // try{
    //     const allProducts = await productModel.find({},"-id");
    //     console.log("allProducts------",allProducts);
    //     return res.json({code:200, message : 'Hey i have found this data' , result : allProducts})
    // }catch(error){
    //     console.log("error------",error);
    //     return res.json({code:500, message : 'Un error server happened' , error : error});
    // }

})

router.delete("/delete-product", (req, res) => {
    //console.log("result--of api-----",req.body);

    productModel.deleteOne()
        .then((result) => {
            //console.log("save api is OK-----",result);
            return res.json({ code: 200, message: "all data are deleted" })
        })

});

module.exports = router