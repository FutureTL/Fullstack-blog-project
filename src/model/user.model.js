import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

username:{
    type:String,
    required:true,
    unique:true
},
fullname:{
    type:stringify,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
    minLength:6
},
description:{
    type:String
},

personalBlog:{
    type: mongoose.Schema.Types.ObjectId,
    ref: personalBlog
},

techBlog:{
    type: mongoose.Schema.Types.ObjectId,
    ref:techBlog
},

avatar:{

}



}, { timestamps:true })

export const User = mongoose.model("User", userSchema);