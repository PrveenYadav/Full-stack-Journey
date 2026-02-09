import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { emailTemplates } from "../utils/emailTemplates.js";
import imagekit from "../config/imagekit.js";
import apiInstance from "../config/brevo.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const uploadProfileImage = async (req, res) => {
  try {
    // checking the file
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Uploading ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `profile_${req.userId}_${Date.now()}`,
      folder: "/profile-images",
    });

    // saving the image URL in database
    const user = await User.findByIdAndUpdate(
    //   req.user.id,
      req.userId, // in userAuth middleware using req.userId  not req.user.id
      { profileImage: uploadResponse.url },
      { new: true }
    );

    // sending the Response
    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: uploadResponse.url,
      user,
    });

  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

export const getUserData = async (req, res) => {
    try {
        const { userId } = req;

        // Find the user in MongoDB
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
 
        // Send the Response
        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                wishlist: user.wishlist,
                addresses: user.addresses,
                birthDate: user.birthDate,
                isAccountVerified: user.isAccountVerified,
                avatar: user.profileImage
            }
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, email, bio, birthDate } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, email, bio, birthDate },
      { new: true, runValidators: true }
    ).select('-password -resetOtp -resetOtpExpireAt -verifyOtp -verifyOtpExpireAt'); // never send password

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        // user,
        userData: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            bio: user.bio,
            birthDate: user.birthDate,
            isAccountVerified: user.isAccountVerified,
            avatar: user.profileImage
        }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};

// google OAuth
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;

    // Existing user without google → link
    if (user && !user.googleId) {
      user.googleId = sub;
      user.profileImage = user.profileImage || picture;
      user.isAccountVerified = true;
      await user.save();
    }

    // New user → create
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        profileImage: picture,
        isAccountVerified: true,
        password: null,
      });

      isNewUser = true;
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //  Send welcome email only if this was a new Google signup
    const sendEmail = async () => {
        const welcomeTemplate = emailTemplates.welcome(name, email);
        
        const smtpEmail = {
            sender: { name: "Outfytly", email: process.env.SENDER_EMAIL },
            to: [{ email: user.email, name: user.name }],
            subject: welcomeTemplate.subject,
            htmlContent: welcomeTemplate.html,
            textContent: welcomeTemplate.text 
        };

        await apiInstance.sendTransacEmail(smtpEmail);
    };

    if (isNewUser) {
        await sendEmail();
    }

    return res
      .status(200)
      .json({ success: true, message: "Google login successful" });

  } catch (error) {
    console.log("Google auth error:", error);
    res.status(500).json({ success: false, message: "Google auth failed" });
  }
};

export const register = async (req, res) => {

    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }

    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: "User already exist"})
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, 
            email, 
            password: hashedPassword
        })

        await newUser.save();

        // creating jwt token
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // sending token in res cookie || cookie settings
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        
        // sending welcome email
        const sendEmail = async () => {
            const welcomeTemplate = emailTemplates.welcome(name, email);
            
            const smtpEmail = {
                sender: { name: "Outfytly", email: process.env.SENDER_EMAIL },
                to: [{ email: email, name: name }],
                subject: welcomeTemplate.subject,
                htmlContent: welcomeTemplate.html,
                textContent: welcomeTemplate.text 
            };

            await apiInstance.sendTransacEmail(smtpEmail);
        };

        await sendEmail();

        return res.status(201).json({ success: true, message: "Registration successful" });

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "Email and Password are required"});
    }

    try {
        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: "Invalid Password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({success: true, message: "User LoggedIn Successfully"})

    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({success: true, message: "Logged out Successfully"})

    } catch (error) {
        console.log("Logout Error: ", error)
        return res.status(500).json({success: false, message: "Logout Failed"});
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        // the userId -> we'll not get it from frontend because we're overwriting it in the userAuth middleware with cookies
        const { userId } = req;

        const user = await User.findById(userId);

        if (user.isAccountVerified) {
            return res.status(400).json({success: false, message: "Account is already Verified"});
        }

        // generation 6 degit otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        await apiInstance.sendTransacEmail({
            sender: { name: "Outfytly", email: process.env.SENDER_EMAIL },
            to: [{ email: user.email, name: user.name }],
            subject: "Account Verification OTP",
            htmlContent: `
                <div>
                    <h2>Your OTP Code</h2>
                    <p>Use the following OTP to verify your account:</p>
                    <h1 style="color: #667eea; font-size: 32px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        });

        res.status(200).json({success: true, message: "Verification OTP sent on Email"})

    } catch (error) {
        return res.status(500).json({success: false, message: "Server Error"});
    }
}

export const verifyEmail = async (req, res) => {
    // const {userId, otp} = req;
    const { otp } = req.body; // coming from frontend
    const { userId } = req; // coming from cookies, you have set it in middleware
    
    if (!userId || !otp) {
        return res.status(401).json({message: "Missing details"});
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User Not Found"});
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({success: false, message: "Invalid OTP"});
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({success: false, message: "OTP Expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.status(200).json({success: true, message: "Email verified Successfully"});

    } catch (error) {
        return  res.status(500).json({success: false, message: "Server Error"});
    }
}

export const isAuthenticated = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		return res.status(200).json({ 
            success: true,
            userData: {
                isAccountVerified: user.isAccountVerified,
            }
        });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const sendResetOtp = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({success: false, message: "Email is Required"})
    }

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({success: false, message: "User Not Found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save(); // saving the resetOtp and resetOtpExpiredAt in database

        await apiInstance.sendTransacEmail({
            sender: { name: "Outfytly", email: process.env.SENDER_EMAIL },
            to: [{ email: user.email, name: user.name }],
            subject: "Password Reset OTP",
            htmlContent: `
                <div>
                    <h2>Your OTP Code</h2>
                    <p>Use the following OTP to reset your password:</p>
                    <h1 style="color: #667eea; font-size: 32px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        });

        return res.status(200).json({success: true, message: "Reset OTP sent on your Email"})

    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.status(400).json({success: false, message: "All fields are Required"})
    }

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({success: false, message: "User Not Found"})
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(401).json({success: false, message: "Invalid OTP"})
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(401).json({success: false, message: "OTP Expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0

        await user.save()

        return res.status(201).json({success: true, message: "Password has been reset successfully"})

    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}