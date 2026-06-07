import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protectRoute=async(req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized no token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({ success: false, message: "Unauthorized invalid token" });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({ success: false, message: "Unauthorized user not found" });
        }
        req.user = user;
        next();
        console.log("Cookie token:", req.cookies.jwt);
    }catch(error){
        console.error("Error in protectRoute:", error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}