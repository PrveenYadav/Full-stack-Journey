import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";

// This middleware will verify user exist or not
//we were not using res so we write underscore(_) instead of res. it is production grade practice
export const verifyJWT = asyncHandler( async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
       if(!token) {
        throw new ApiError(401, "Unauthorized request");
       } 
    
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
       await User.findById(decodedToken?._id).select("-password -refreshToken")
    
       if(!user) {
        //something to do........
        throw new ApiError(401, "Invalid Access Token")
       }
    
       req.user = user;
       next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
}) 