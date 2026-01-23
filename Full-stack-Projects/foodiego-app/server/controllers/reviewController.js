import { Product } from "../models/productModel.js"
import imagekit from "../config/imagekit.js";

export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, name } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = null;

    // Multer memoryStorage file upload
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer, // ✅ Buffer
        fileName: `review-${productId}-${Date.now()}`,
        folder: "/reviews"
      });

      imageUrl = uploadResponse.url;
    }

    const newReview = {
      rating: Number(rating),
      comment,
      name,
      image: imageUrl,
      date: new Date()
    };

    product.reviews.push(newReview);

    // Recalculate ratings
    product.ratingUsers = product.reviews.length;

    const totalRating = product.reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    product.averageRating = Number(
      (totalRating / product.ratingUsers).toFixed(1)
    );

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
      averageRating: product.averageRating,
      ratingUsers: product.ratingUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).select(
      "reviews averageRating ratingUsers"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

