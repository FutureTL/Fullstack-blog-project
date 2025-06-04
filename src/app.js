import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()


//mostly woth middlewares or configurations, we use app.use()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({
    limit:"20kb"
}))

app.use(express.static("public"))

app.use(cookieParser())  //use: so that we can access the cookies from the browser of the user.
                         //basically so that we can perform crud operations on the cookies of the user.
export { app };