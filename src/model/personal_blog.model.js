import mongoose from "mongoose";

const personBlogSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    },

},{timestamps:true})

export const personalBlog = mongoose.model("personalBlog", personBlogSchema);