import { User } from "../model/user.model.js";
import { personalBlog } from "../model/personal_blog.model.js";
import { techBlog } from "../model/tech_blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";



//generating hash for the password:
const generatePasswordHash = async function(password){
    
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log("here is hash value: ", hash)
    return hash;
   
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
   console.log("this is the hashed password: ",hashPassword);

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
            password:hashPassword,
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

const loginUser = asyncHandler( async(req, res, next) => {

  //when user logins in, I want to provide her/him, with both the access and refresh tokens
  //when access token expires, the refresh token must be used to refresh the access token, but
  //this process should be rotation based, that means when access token is refreshed the access token
  //must also get refreshed-> why? -> to ensure less vulnerability of a longer exposed refresh token.

  //login: user will login with email or username as both are kept unique in this application, along with password.
  //access token and refresh token will be generated for the user. 
  //Both these will be stored in the database of the user, only the refresh token will be given to the user.
  //when the access token of the user expires, the refresh token value will be compared to generate new refresh and access token(rotation based).

  const {email, username, password} = req.body;
  if(!(email || username)){
    throw new ApiError(409, "Email or login required for login!");
  }

  const user = await User.findOne({
    $or:[{email},{username}]
  })
  console.log("user detail with given email or username: ", user);

  if(!user){
    throw new ApiError(409, "username or email not found!");
  }
  //now my logic is that user exists, so I will take his email or username and find the id 
  //of this user. once we have that now we can compare the password of the user.
  
  
  const verifiedPassword = await user.verifyPassword(password);
  console.log("output for verified pass: ", verifiedPassword)

  if(!verifiedPassword){
    throw new ApiError(409, "incorrect password");
  }
  //if we have reached here then user is verified, his email/username and password have matched.

  //now our objective:
  //Step 1: generate access and refresh token for this user 
  //STEP 2:store the generated ones in the databse of the user
  //STEP 3:return the refresh token to the user.

  //Step 1:
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  //step 2:
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  const result = await user.save();
  if(!result){
    throw new ApiError(400, "Failed to save tokens to the database!");
  }

  console.log("if tokens are saved to database, here is the response: ", result);
  
  console.log("Response object: ", new ApiResponse(200, refreshToken, "Sending refresh token to the user"));

  return res
  .status(200)
  .json(
    new ApiResponse(200, refreshToken, "Sending refresh token to the user")
  )
  

})
//now I have completed the routes- register and login
//now our focus will be blog routes- tech and personal.

const personalBlogs = asyncHandler(async(req, res, next)=>{
    //here a user will be able to see all the personal blogs published 
    //latest appearing first.

    //logic: we will get all the personal blogs published- latest first:
  const allPersonalBlogs =  await personalBlog.find({}).sort({"createdAt":-1})
  
  console.log("returning the response to the user: ", new ApiResponse(200, allPersonalBlogs, "see api resonse to the user"));

  return res
  .status(201)
  .json(new ApiResponse(
    200,
    allPersonalBlogs,
    "All personal blogs shared with user!"
  ))

})

const techBlogs = asyncHandler(async(req, res, next)=>{
    //here a user will be able to see all the personal blogs published 
    //latest appearing first.

    //logic: we will get all the personal blogs published- latest first:
  const alltechBlogs =  await techBlog.find({}).sort({"createdAt":-1})
  
  console.log("returning the response to the user: ", new ApiResponse(200, alltechBlogs, "see api resonse to the user"));

  return res
  .status(201)
  .json(new ApiResponse(
    200,
    alltechBlogs,
    "All tech blogs shared with user!"
  ))

})

const allwriters = asyncHandler( async(req, res,next)=>{

  //here the list of all the writers will be displayed. 
  //guide for the frontend engineer- the information will be displayed in
  //in the form of playcards each showing the following details of the user:
    // 1. fullname
    // 2. username
    // 3. description
    // 4. tech-blogs of the user
    // 5. personal- blogs of the user

    //as it is a get request we have to send and display data to the user.

    const user = await User.find({}).sort({fullname:1}).select("-password -refreshToken -accessToken -createdAt -updatedAt -_id")

    return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Here is the list of all the users")
    )

})



export {
  registerUser,
  loginUser,
  personalBlogs,
  techBlogs,
  allwriters
}