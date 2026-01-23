import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import { Order } from '../models/orderModel.js';
import { Admin } from '../models/adminModel.js';
import bcrypt from "bcryptjs";
import imagekit from "../config/imagekit.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({
        success: true,
        message: "Admin logged in",
        admin: {
          email: admin.email,
          profileImage: admin.profileImage
        }
      });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const logout = (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
    .status(200)
    .json({
        success: true,
        message: "Admin logged out"
    });
};

// controller to check is authenticated
export const getAdminMe = async (req, res) => {
  const admin = await Admin.findById(req.adminId).select("-password");

  res.status(200).json({
    success: true,
    admin
  });
};

export const uploadProfileImage = async (req, res) => {
    // console.log("Admin id: ", req.adminId)
    // console.log("File is : ", req.file)
    
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `admin_${req.adminId}_${Date.now()}`,
      folder: "/admin-profile-images"
    });

    const admin = await Admin.findByIdAndUpdate(
      req.adminId,
      { profileImage: uploadResponse.url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image updated",
      profileImage: admin.profileImage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed"
    });
  }
};



// this is just for testing -----------------------------------------

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Admin created",
      admin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated",
      admin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// -----------------------------------------------------------------


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})

        if (!users) {
            return res.status(404).json({message: "Users Not Found"})
        }

        res.status(200).json({success: true, users})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const deleteUser = async (req, res) => {
  
  // console.log("id: ", req.params)
  const { id } = req.params

    try {

        await User.findByIdAndDelete(id)
        res.status(201).json({success: true, message: "User deleted successfully"})
    } catch (error) {
        return res.status(500).json({success: false, message: "Error in deleting user"})
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const items = await Product.find();
        if (!items) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({success: true, items});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOne({ orderId: req.params.id })
    // const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent changes after delivery
    if (order.status === "delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be updated"
      });
    }

    order.status = status;

    // Auto mark COD orders as paid when delivered
    if (
      status === "delivered" &&
      order.paymentInfo.method === "cod"
    ) {
      order.paymentInfo.status = "paid";
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order
    });
  } catch (error) {
    console.error("Update order status error: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Get all orders error: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  // console.log("req params rder id: ", req.params.orderId)
  // console.log("req params id: ", req.params.id)

  try {
    // const order = await Order.findOne({ orderId: req.params.orderId });
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error("Delete order error: ", error);
    res.status(500).json({ message: error.message });
  }
};

// customers or customers info
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.aggregate([
      // Lookup orders for each user
      {
        $lookup: {
          from: "orders", // MongoDB collection name         
          localField: "_id",
          foreignField: "user",
          as: "orders"
        }
      },

      // Calculate stats
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalSpent: {
            $sum: "$orders.totalAmount"
          }
        }
      },

      // Select only required fields
      {
        $project: {
          name: 1,
          email: 1,
          totalOrders: 1,
          totalSpent: 1,
          joinDate: "$createdAt"
        }
      },

      // Optional: sort by newest users
      {
        $sort: { joinDate: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      customers
    });

  } catch (error) {
    console.error("Get all customers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// reviews 
export const getAllProductReviews = async (req, res) => {
  
  try {
    const { page = 1, limit = 10, rating } = req.query;

    const products = await Product.find({})
      .select("name reviews averageRating")
      .lean();

    let allReviews = [];

    
    console.log("Products : ", products)

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        allReviews.push({
          productId: product._id,
          productName: product.name,
          averageRating: product.averageRating,
          reviewId: review._id,
          rating: review.rating,
          comment: review.comment,
          name: review.name,
          image: review.image,
          date: review.date
        });
      });
    });

    console.log("All Reviews: ", allReviews)

    // Optional filter by rating
    if (rating) {
      allReviews = allReviews.filter(
        (r) => r.rating === Number(rating)
      );
    }

    // Sort latest first
    allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedReviews = allReviews.slice(
      startIndex,
      startIndex + Number(limit)
    );

    res.status(200).json({
      totalReviews: allReviews.length,
      currentPage: Number(page),
      totalPages: Math.ceil(allReviews.length / limit),
      reviews: paginatedReviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // product.reviews.splice(reviewIndex, 1);
    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    product.ratingUsers = product.reviews.length;

    const totalRating = product.reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    product.averageRating =
      product.ratingUsers === 0
        ? 0
        : (totalRating / product.ratingUsers).toFixed(1);

    await product.save();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

