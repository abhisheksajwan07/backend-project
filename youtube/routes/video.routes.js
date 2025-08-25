import express from "express";
import mongoose from "mongoose";

import logger from "../config/logger.js";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../config/multer.js";
import { checkAuth } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/upload",checkAuth,async(req,res)=>{
    try{
       const {title,description,tags,category}= req.body;
        
    }
    catch(err){

    }
})


export default router