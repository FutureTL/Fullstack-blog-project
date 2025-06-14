import {loginUser, registerUser, personalBlogs, techBlogs, allwriters, particularWriterDetails} from "../controller/user.controller.js";
import express from "express"
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/register").post( //router

    upload.fields([{ name: 'avatar', maxCount: 1 }]), //middleware

    registerUser //controller

)
router.route("/login").post(loginUser)

router.route("/personal-blogs").get(personalBlogs)

router.route("/tech-blogs").get(techBlogs);

router.route("/our-writers").get(allwriters);

router.route("/our-writers/:username").get(particularWriterDetails);


export default router;