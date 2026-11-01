
const Product = require('../model/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Remove temporary uploaded file
const removeTempFile = (filePath) => {
    if (filePath) {
        fs.unlink(filePath, (error) => {
            if (error) {
                console.error('Temporary file cleanup error:', error.message);
            }
        });
    }
};

// Upload image to Cloudinary
const uploadProductImage = async (file) => {
    if (!file) return null;

    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'nexcart/products',
            resource_type: 'image'
        });

        return result.secure_url;
    } finally {
        removeTempFile(file.path);
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });

        return res.status(200).json(products);

    } catch (error) {
        console.error('Get products error:', error);

        return res.status(500).json({
            message: 'Unable to fetch products'
        });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        return res.status(200).json(product);

    } catch (error) {
        console.error('Get product error:', error);

        return res.status(500).json({
            message: 'Unable to fetch product'
        });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        } = req.body;

        if (!name || !description || !category ||
            price === undefined || stock === undefined) {
            return res.status(400).json({
                message: 'Please provide all required product fields'
            });
        }

        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: 'Price must be a valid non-negative number'
            });
        }

        if (!Number.isInteger(numericStock) || numericStock < 0) {
            return res.status(400).json({
                message: 'Stock must be a non-negative integer'
            });
        }

        let finalImageUrl = imageUrl || '';

        if (req.file) {
            finalImageUrl = await uploadProductImage(req.file);
        }

        if (!finalImageUrl) {
            return res.status(400).json({
                message: 'Product image is required'
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description,
            price: numericPrice,
            category,
            stock: numericStock,
            imageUrl: finalImageUrl
        });

        return res.status(201).json(product);

    } catch (error) {
        console.error('Create product error:', error);

        return res.status(500).json({
            message: 'Unable to create product'
        });
    } finally {
        // Remove temp file if upload was not reached or failed
        if (req.file?.path && fs.existsSync(req.file.path)) {
            removeTempFile(req.file.path);
        }
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const {
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        } = req.body;

        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (category !== undefined) product.category = category;
        if (imageUrl !== undefined) product.imageUrl = imageUrl;

        if (price !== undefined) {
            const numericPrice = Number(price);

            if (!Number.isFinite(numericPrice) || numericPrice < 0) {
                return res.status(400).json({
                    message: 'Invalid price'
                });
            }

            product.price = numericPrice;
        }

        if (stock !== undefined) {
            const numericStock = Number(stock);

            if (!Number.isInteger(numericStock) || numericStock < 0) {
                return res.status(400).json({
                    message: 'Invalid stock'
                });
            }

            product.stock = numericStock;
        }

        if (req.file) {
            product.imageUrl = await uploadProductImage(req.file);
        }

        const updatedProduct = await product.save();

        return res.status(200).json(updatedProduct);

    } catch (error) {
        console.error('Update product error:', error);

        return res.status(500).json({
            message: 'Unable to update product'
        });
    } finally {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            removeTempFile(req.file.path);
        }
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                message: 'Invalid product ID'
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);

        return res.status(500).json({
            message: 'Unable to delete product'
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};


