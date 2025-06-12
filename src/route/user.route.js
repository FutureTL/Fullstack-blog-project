import {loginUser, registerUser} from "../controller/user.controller.js";
import express from "express"
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/register").post( //router

    upload.fields([{ name: 'avatar', maxCount: 1 }]), //middleware

    registerUser //controller

)
router.route("/login").post(loginUser)


export default router;