import express from "express";
import {createProduct,
  getProducts,
  updateProduct,
  getProductsByName,
  getProductsByCreatedAt,
  getProductsByStock,
  deleteProductById,
  getProductById,
  upload,
  } from "../controller/productController";
const router = express.Router();
// import upload from '../middleware/authMiddleware';






router.post("/products", upload.array("images", 2), createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById); // Make sure this is uncommented if you need to fetch by ID
router.put("/:id", upload.array("images", 5), updateProduct);
// router.put("/products/:id", updateProduct);
// router.delete("/products/:id", deleteProductById); 
router.delete("/products/:id", (req, res) => deleteProductById(req, res) as any);


router.post("/filter/name", getProductsByName);
router.post("/filter/createdAt", getProductsByCreatedAt);
router.post("/filter/stock", getProductsByStock);


export default router;
