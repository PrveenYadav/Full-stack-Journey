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
    // const id = req.params.id
    const { id } = req.params

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({success: false, message: `Product not found with ID: ${id}`});
        }

        res.status(200).json({success: true, product});
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(400).json({
            success: false,
            message: "Invalid product ID format or server error."
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
            calories,
            ingredients,
            nutrients
        } = req.body;

        // get image files from Multer
        const images = req.files;

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            });
        }

        // Upload Images to ImageKit
        const imageKitUploadPromises = images.map(file => {
            const base64File = file.buffer.toString('base64');

            return imagekit.upload({
                file: base64File,
                fileName: `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`,
                folder: '/foodiego',
            });
        });

        const imageKitResults = await Promise.all(imageKitUploadPromises);

        // prepare image data
        const imageList = imageKitResults.map(result => ({
            public_id: result.fileId,
            url: result.url,
        }));

        // parsing ingredients & nutrients safely
        const parsedIngredients = ingredients
            ? Array.isArray(ingredients)
                ? ingredients
                : JSON.parse(ingredients)
            : undefined;

        const parsedNutrients = nutrients
            ? Array.isArray(nutrients)
                ? nutrients
                : JSON.parse(nutrients)
            : undefined;

        // create Product
        const product = await Product.create({
            name,
            description,
            price,
            category,
            calories,
            ingredients: parsedIngredients,
            nutrients: parsedNutrients,
            images: imageList,
        });

        res.status(201).json({
            success: true,
            message: 'Product added successfully.',
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    let finalImages = [];

    if (req.body.existingImages) {
      try {
        const parsed =
          typeof req.body.existingImages === "string"
            ? JSON.parse(req.body.existingImages)
            : req.body.existingImages;

        finalImages = parsed.map(img => ({
          public_id: img.public_id,
          url: img.url
        }));

      } catch (err) {
        console.error("existingImages parse error:", err);
        finalImages = [];
      }
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        const base64File = file.buffer.toString("base64");
        return imagekit.upload({
          file: base64File,
          fileName: `${Date.now()}_${file.originalname}`,
          folder: "/ecom-products",
        });
      });

      const imageKitResults = await Promise.all(uploadPromises);

      // ✅ FIX: store both public_id & url
      const newImages = imageKitResults.map((r) => ({
        public_id: r.fileId, // ImageKit file ID
        url: r.url
      }));

      finalImages.push(...newImages);
    }

    req.body.images = finalImages;

    // Required for form data 
    // parsing ingredients (array of strings)
    if (req.body.ingredients) {
        req.body.ingredients = JSON.parse(req.body.ingredients);
    }

    // parsing nutrients (array of objects)
    if (req.body.nutrients) {
        req.body.nutrients = JSON.parse(req.body.nutrients);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      updatedProduct,
    });

  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(400)
      .json({ success: false, message: "Update failed or invalid data provided." });
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