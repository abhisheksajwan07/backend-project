import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";


const router = express.Router();

router.post("/signup",async(req,res)=>{
    console.log("bdiyaaa")
    res.send("sab bidya")

})


export default router;