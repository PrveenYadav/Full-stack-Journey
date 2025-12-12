import User from "../models/userModel.js";


// (getUsers, deleteUser) just for checking/testing in backend - there is no need of this in frontend
export const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({})
        return res.status(200).json({status: true, allUsers})
    } catch (error) {
        return res.status(500).json({success: false, message: "Error in getting users data"})
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.body
        await User.findByIdAndDelete(id)
        res.status(201).json({success: true, message: "User deleted successfully"})
    } catch (error) {
        return res.status(500).json({success: false, message: "Error in deleting user"})
    }
}


// sending only user's name and isAuthenticated to frontend
export const getUserData = async (req, res) => {
    try {
        // const { userId } = req.body; 
        const { userId } = req; // not req.body, from cookies, check in the userAuth middleware

        // 2. Find the user in MongoDB
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // 3. Send the Response
        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}