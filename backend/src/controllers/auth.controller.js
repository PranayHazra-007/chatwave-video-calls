import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


export async function signup(req, res) {
        const { fullName, email, password } = req.body;

        try{
            if(!fullName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if(password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            const emailRegex=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if(!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email address" });
            }
            const existingUser = await User.findOne({ email });
            if(existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }
            const idx=Math.floor(Math.random()*100)+1;
            const randomAvatar=`https://avatar.iran.liara.run/public/${idx}`;
            const newUser= await User.create({
                email,
                fullName,
                password,
                profilePic: randomAvatar
            })

                try{
                    await upsertStreamUser({
                    id: newUser._id.toString(),
                    name: newUser.fullName,
                    image: newUser.profilePic || ""
                });
                console.log(`Stream user created for user: ${newUser.fullName}`);
                }catch(error){
                    console.error("Error upserting Stream user:", error);
                }

            const token=jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
             res.cookie("jwt",token,{
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite:"strict",
                secure: process.env.NODE_ENV === "production"
             })
             res.status(201).json({
  success: true,
  user: {
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic
  }
});
       }catch(error){
    console.log("Signup Error:", error);
    res.status(500).json({
        success:false,
        message:error.message
    });
}
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        console.log("Email:", email);
        console.log("Password:", password);

        const user = await User.findOne({ email });

        console.log("User Found:", user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await user.matchPassword(password);

        console.log("Password Match:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET_KEY,
  { expiresIn: "7d" }
);

res.cookie("jwt", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
});

        res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.log("Login Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success:true, message: "User logged out successfully" });
}

export async function onboard(req,res) {
    try{
        const userId = req.user._id;
        const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({ 
                success: false,
                message: "All fields are required",
                missingFields:[
                    !fullName && "Full name is required",
                    !bio && "Bio is required",
                    !nativeLanguage && "Native language is required",
                    !learningLanguage && "Learning language is required",
                    !location && "Location is required"
                ].filter(Boolean),
             });
        }
       const updateUser = await User.findByIdAndUpdate(
  userId,
  { ...req.body, isOnboarded: true },
  { returnDocument: "after" }
);
        if(!updateUser){
            return res.status(404).json({ 
                success: false,
                message: "User not found"
            });
        }
       try{
         await upsertStreamUser({
            id:updateUser._id.toString(),
            name:updateUser.fullName,
            image:updateUser.profilePic || ""
        });
       }catch(streamError){
            console.error("Error upserting Stream user:", streamError.message);
       }
        res.status(200).json({
            success: true,
            message: "Onboarding completed successfully",
            user: updateUser
        });
    }catch(error){
        console.error("Error in onboard:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}