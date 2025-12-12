import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import transporter from "../configs/nodemailer.js";
import { emailTemplates } from "../utils/emailTemplate.js";

export const register = async (req, res) => {
    // Taking valid user details
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }

    try {
        // checking for existing user
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({message: "User already exist"})
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // creating new user
        const newUser = new User({
            name, 
            email, 
            password: hashedPassword
        })

        // saving in database
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
        const welcomeTemplate = emailTemplates.welcome(name, email)

        const mailOptions = {
            from: {
                name: "Developer's World",
                address: process.env.SENDER_EMAIL
            },
            to: email,
            subject: welcomeTemplate.subject,
            html: welcomeTemplate.html,
            text: welcomeTemplate.text
        };

        await transporter.sendMail(mailOptions);

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

        const mailOptions = {
            // from: process.env.SENDER_EMAIL,
            from: {
                name: "Developer's World",
                address: process.env.SENDER_EMAIL
            },
            to: user.email,
            subject: "Account Verification OTP",
            // text: `Your OTP is ${otp}. Verify your account using this OTP.`
            html: `
                <div>
                    <h2>Your OTP Code</h2>
                    <p>Use the following OTP to verify your account:</p>
                    <h1 style="color: #667eea; font-size: 32px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        }

        await transporter.sendMail(mailOptions);

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

		return res.status(200).json({ success: true, user });
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

        const mailOptions = {
            // from: process.env.SENDER_EMAIL,
            from: {
                name: "Developer's World",
                address: process.env.SENDER_EMAIL
            },
            to: user.email,
            subject: "Password Reset OTP",
            html: `
                <div>
                    <h2>Your OTP Code</h2>
                    <p>Use the following OTP to reset your password:</p>
                    <h1 style="color: #667eea; font-size: 32px;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        }

        await transporter.sendMail(mailOptions);

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