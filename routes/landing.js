const express = require("express")
const router = express.Router();

router.get('/',(req,res)=>{
    res.render("landing/index")
})

module.exports = router;