import dotenv from "dotenv"
import { mongodbConnect } from "./db/connect.js" 
import { app } from  "./app.js";



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
