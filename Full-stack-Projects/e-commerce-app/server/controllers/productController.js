import { Product } from "../models/productModel.js"
import imagekit from "../config/imagekit.js";

export const getAllProducts = async (req, res) => {
    try {
        const items = await Product.find();
        if (!items) {
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({success: true, count: items.length, items});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const getProductDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: `Product not found with ID: ${id}` });
    }

    // Parallel queries (fast)
    const [related, featured, bestSellers, onSale, newArrivals] =
      await Promise.all([
        // Related products by tags (excluding current product)
        Product.find({
          _id: { $ne: id },
          tags: { $in: product.tags },
        }).limit(8),

        // Featured
        Product.find({ isFeatured: true }).limit(8),

        // Best sellers
        Product.find().sort({ soldCount: -1 }).limit(8),

        // On sale
        Product.find({ discountPercentage: { $gt: 0 } }).limit(8),

        // New arrivals
        Product.find({ isNewArrival: true })
          .sort({ createdAt: -1 })
          .limit(8),
      ]);

    res.status(200).json({
      success: true,
      product,
      relatedProducts: related,
      featuredProducts: featured,
      bestSellers,
      onSaleProducts: onSale,
      newArrivals,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(400).json({
      success: false,
      message: "Invalid product ID format or server error.",
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      variants,
      isNewArrival,
    } = req.body;

    // get image files from Multer
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Upload Images to ImageKit
    const imageKitUploadPromises = images.map((file) => {
      const base64File = file.buffer.toString("base64");

      return imagekit.upload({
        file: base64File,
        fileName: `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`,
        folder: "/Outfytly",
      });
    });

    const imageKitResults = await Promise.all(imageKitUploadPromises);

    // prepare image data
    const imageList = imageKitResults.map((result) => ({
      public_id: result.fileId,
      url: result.url,
    }));

    // parsing variants (array of objects)
    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;

    // create Product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      subCategory,
      isNewArrival,
      variants: parsedVariants,
      images: imageList,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      subCategory,
      variants,
      isNewArrival,
      existingImages
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Parse variants (array of objects)
    const parsedVariants = typeof variants === "string" ? JSON.parse(variants.trim()) : variants;

    // handle images
    let finalImages = [];

    // keep old images user selected
    if (existingImages) {
      const parsedExisting =
        typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;

      finalImages = parsedExisting.map((img) => ({
        public_id: img.public_id,
        url: img.url,
      }));
    }

    // upload new images if any
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        const base64File = file.buffer.toString("base64");

        return imagekit.upload({
          file: base64File,
          fileName: `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`,
          folder: "/Outfytly",
        });
      });

      const imageKitResults = await Promise.all(uploadPromises);

      const newImages = imageKitResults.map((result) => ({
        public_id: result.fileId,
        url: result.url,
      }));

      finalImages.push(...newImages);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        subCategory,
        variants: parsedVariants,
        isNewArrival,
        images: finalImages,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {

    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        res.status(200).json({success: true, message: "Product deleted successfully."});
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Failed to delete product." });
    }
};