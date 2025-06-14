import dotenv from "dotenv"
import { mongodbConnect } from "./db/connect.js" 
import { app } from  "./app.js";



import { personalBlog } from "./model/personal_blog.model.js";
import mongoose from "mongoose";
import { User } from "./model/user.model.js";
import { ApiError } from "./utils/ApiError.js";


dotenv.config({
    path: './env'
})

const CurrentPort = process.env.PORT || 8000


mongodbConnect()
.then(()=>{
    const server = app.listen(CurrentPort,()=>{
        console.log("application running on port: ", CurrentPort)
    })

    server.on("error", (error)=>{
        console.log("problem in connecting to the server: ", error)
    })

})
.catch((error)=>{
    console.log("database connection has failed: ", error)
})

//this is my test code:
const user = await User.findOne({
    username:"oravm"
})

if(!user){
    throw new ApiError(409, "this user does not exist");
}



const firstBlog = await personalBlog.create({
    title: "My 1st blog",
    author: user._id,
    content:"My day is not going that great. I feel like laying back and just reading a book."
})

console.log("my first test blog: ", firstBlog)