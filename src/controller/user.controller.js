import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



//generating hash for the password:
const generatePasswordHash = async function(password){
    
    const salt =10;
    bcrypt
    .hash(password, salt)
    .then((hash)=>{
        console.log("hash generated for the password: ", hash);
    })
    .catch((err)=>{
        console.log("error while generating hash of password: ", err)
    })
    
}

//logic for user registration:
const registerUser = asyncHandler(async(req, res, next)=>{

   const {username, fullname, password, confirmPassword, email,description} = req.body;
   //using req.bosy we can get only the text values not files(images, videos, pdf)
    
   if(password != confirmPassword){
    throw new ApiError(400, "password should be equal to confirmed password!");
   }

   if(!username || !email || !password || !fullname){
    throw new ApiError(409, "all necessary details must be filled out.");
   }

   //we will check one that the user trying to register is not already registered.
   if(email == User.findOne(email) ){
    throw new ApiError(409, "Email already exists!")
   }

   if(username == User.findOne(username)){
    throw new ApiError(409, "Username already exists!")
   }

   //here I can also employ some checks for email, will do that later on.

   //right now, since user is valid, we have to put info in database.

   //also password in hashed form will be stored in the database
   const hashPassword = await generatePasswordHash(password);

   //avatar is taken from user -> upload to local storage using multer ->
   //upload to cloudinary -> link is taken from cloudinary to store in local database.
   
    //  upload.single('avatar') why we didn't write this line.
    const avatarLocalPath = req.files?.avatar[0]?.path //how are able to use the name avatar without any error being thrown
    console.log("req.files: ", req.files);
    console.log("here is the path for avatar file: ", avatarLocalPath)
    if(!avatarLocalPath){
      throw new ApiError(409, "Avatar image required!")
    }
    const avatar = await uploadToCloudinary(avatarLocalPath);
    console.log("avatar details: ", avatar)

    if(!avatar){
      throw new ApiError(400, "Image could not be uploaded on cloudinary!")
    }
    


    const user = await User.create({
            username: username.toLowerCase(),
            fullname,
            email,
            password,
            description,
            avatar: avatar.url,
            
        })
        console.log("user detail: ", user);
        //here in select we put the fields we want to remove from the reponse of user.
        const userCreated = await User.findById(user._id).select("-password -refreshToken");
        if(!userCreated){
            throw new ApiError(500, "something went wrong in registering the user!");
        }

        console.log("user created", userCreated);

    
        return res.status(201).json(
              new ApiResponse(200, userCreated, "user registered successfully")
        );
    

})



export {
  registerUser
}