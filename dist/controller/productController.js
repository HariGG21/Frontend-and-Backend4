"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.getProductsByStock = exports.getProductsByCreatedAt = exports.getProductsByName = exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const productmodel_1 = __importDefault(require("../models/productmodel"));
// Configure Multer for file uploads
// productController.ts
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Set the path to the 'uploads' directory at the root level
        cb(null, path_1.default.join(__dirname, '..', '..', 'uploads', 'product_images')); // Adjust path here
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Use unique file names
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only image files (JPEG, PNG, GIF) are allowed."));
    },
});
exports.upload = upload;
// Helper to handle errors
const handleError = (res, error, message) => {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({ message, error: errorMessage });
};
// Create a product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, stock } = req.body;
    const images = req.files;
    // Validate input
    if (!name || !price || !stock) {
        res.status(400).json({ message: "Name, price, and stock are required." });
        return;
    }
    if (!images || images.length === 0) {
        res.status(400).json({ message: "At least one image is required." });
        return;
    }
    try {
        // Construct the product object
        const product = new productmodel_1.default({
            name,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            images: images.map((img) => img.path.replace('src', 'uploads')) // Adjust path here if needed
        });
        // Save the product in the database
        yield product.save();
        // Return a success message with the created product
        res.status(201).json({ message: "Product created successfully", product });
    }
    catch (error) {
        handleError(res, error, "Error creating product");
    }
});
exports.createProduct = createProduct;
// Get all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productmodel_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        handleError(res, error, "Error fetching products");
    }
});
exports.getProducts = getProducts;
// Update a product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const images = req.files;
    try {
        const product = yield productmodel_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        product.name = name || product.name;
        product.price = price ? parseFloat(price) : product.price;
        product.stock = stock ? parseInt(stock, 10) : product.stock;
        if (images && images.length > 0) {
            product.images = images.map((img) => img.path);
        }
        yield product.save();
        res.status(200).json({ message: "Product updated successfully", product });
    }
    catch (error) {
        handleError(res, error, "Error updating product");
    }
});
exports.updateProduct = updateProduct;
// Delete a product by ID
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedProduct = yield productmodel_1.default.findByIdAndDelete(id);
        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    }
    catch (error) {
        handleError(res, error, "Error deleting product");
    }
});
exports.deleteProduct = deleteProduct;
// Get products by Name
const getProductsByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ message: "Name is required for searching." });
        return;
    }
    try {
        const products = yield productmodel_1.default.find({ name: { $regex: name, $options: "i" } });
        res.status(200).json(products);
    }
    catch (error) {
        handleError(res, error, "Error fetching products by name");
    }
});
exports.getProductsByName = getProductsByName;
// Get products by CreatedAt
const getProductsByCreatedAt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate } = req.body;
    if (!startDate) {
        res.status(400).json({ message: "Start date is required for filtering." });
        return;
    }
    try {
        const date = new Date(startDate);
        if (isNaN(date.getTime())) {
            res.status(400).json({ message: "Invalid date format." });
            return;
        }
        const products = yield productmodel_1.default.find({ createdAt: { $gte: date } });
        res.status(200).json(products);
    }
    catch (error) {
        handleError(res, error, "Error fetching products by created date");
    }
});
exports.getProductsByCreatedAt = getProductsByCreatedAt;
// Get products by Stock
const getProductsByStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { minStock } = req.body;
    if (!minStock) {
        res.status(400).json({ message: "Minimum stock value is required for filtering." });
        return;
    }
    try {
        const stock = parseInt(minStock, 10);
        if (isNaN(stock)) {
            res.status(400).json({ message: "Invalid minimum stock value." });
            return;
        }
        const products = yield productmodel_1.default.find({ stock: { $gte: stock } });
        res.status(200).json(products);
    }
    catch (error) {
        handleError(res, error, "Error fetching products by stock");
    }
});
exports.getProductsByStock = getProductsByStock;
