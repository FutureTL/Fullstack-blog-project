import dotenv from "dotenv"
import { mongodbConnect } from "./db/connect.js" 
import { error } from "console"


dotenv.config({
    path: './env'
})


mongodbConnect()
.then(
    console.log("mongodb databse connected successfully")
)
.catch(
    console.log( "connection failed: ",error)
)