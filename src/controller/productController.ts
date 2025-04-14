import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import Product from "../models/productmodel";

// Configure Multer for file uploads

// productController.ts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the path to the 'uploads' directory at the root level
    cb(null, path.join(__dirname, '..', '..', 'uploads'));  // Adjust path here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use unique file names
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (JPEG, PNG, GIF) are allowed."));
  },
});


// Helper to handle errors
const handleError = (res: Response, error: unknown, message: string): void => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
  res.status(500).json({ message, error: errorMessage });
};

// Create a product
const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, price, stock } = req.body;
  const images = req.files as Express.Multer.File[];

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
    const product = new Product({
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      images:images.map((img) => path.join(img.filename).replace(/\\/g, '/')),
    });

    // Save the product in the database
    await product.save();

    // Return a success message with the created product
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    handleError(res, error, "Error creating product");
  }
};

// Get all products
const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    handleError(res, error, "Error fetching products");
  }
};



const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
      const product = await Product.findById(id);
      if (!product) {
          res.status(404).json({ message: "Product not found" });
          return;
      }
      res.status(200).json(product);
  } catch (error) {
      handleError(res, error, "Error fetching product by ID");
  }
};


// Update a product
// Update a product
// Update a product
const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Get the ID from the URL parameter
  const { name, price, stock } = req.body; // Get other fields from the request body
  const images = req.files as Express.Multer.File[]; // Get uploaded files

  try {
      const product = await Product.findById(id);
      if (!product) {
          res.status(404).json({ message: "Product not found" });
          return;
      }

      product.name = name || product.name;
      product.price = price ? parseFloat(price) : product.price;
      product.stock = stock ? parseInt(stock, 10) : product.stock;

      if (images && images.length > 0) {
          product.images = images.map((img) => path.join(img.filename).replace(/\\/g, '/'));
      }

      const updatedProduct = await product.save(); // Save the updated product
      res.status(200).json({
          message: "Product updated successfully",
          product: updatedProduct,
      });
  } catch (error: any) {
      console.error("Error updating product:", error); // Log the error on the server
      res.status(500).json({
          message: "Failed to update product",
          error: error.message,
      }); // Send a JSON error response
      return; // Ensure you return after handling the error
  }
};


// const updateProduct = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
//   const { name, price, stock } = req.body;
//   const images = req.files as Express.Multer.File[];

//   console.log('Updating product with ID:', id);
//   console.log('Request Body:', req.body);
//   console.log('Request Files:', req.files);

//   try {
//       const product = await Product.findById(id);
//       if (!product) {
//           res.status(404).json({ message: "Product not found" });
//           return;
//       }

//       product.name = name || product.name;
//       product.price = price ? parseFloat(price) : product.price;
//       product.stock = stock ? parseInt(stock, 10) : product.stock;

//       if (images && images.length > 0) {
//           product.images = images.map((img) =>
//               path.join("product_images", img.filename).replace(/\\/g, "/")
//           );
//       }

//       const updatedProduct = await product.save();
//       res.status(200).json({
//           message: "Product updated successfully",
//           product: updatedProduct,
//       });
//   } catch (error: any) {
//       console.error("Error updating product:", error);
//       res.status(500).json({
//           message: "Failed to update product",
//           error: error.message,
//       });
//   }
// };




// Delete a product by ID
const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// Get products by Name
const getProductsByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: "Name is required for searching." });
    return;
  }

  try {
    const products = await Product.find({ name: { $regex: name, $options: "i" } });
    res.status(200).json(products);
  } catch (error) {
    handleError(res, error, "Error fetching products by name");
  }
};

// Get products by CreatedAt
const getProductsByCreatedAt = async (req: Request, res: Response): Promise<void> => {
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

    const products = await Product.find({ createdAt: { $gte: date } });
    res.status(200).json(products);
  } catch (error) {
    handleError(res, error, "Error fetching products by created date");
  }
};

// Get products by Stock
const getProductsByStock = async (req: Request, res: Response): Promise<void> => {
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

    const products = await Product.find({ stock: { $gte: stock } });
    res.status(200).json(products);
  } catch (error) {
    handleError(res, error, "Error fetching products by stock");
  }
};

export {
  createProduct,
  getProducts,
  updateProduct,
  deleteProductById,
  getProductsByName,
  getProductsByCreatedAt,
  getProductsByStock,
  upload,
  getProductById,
};
