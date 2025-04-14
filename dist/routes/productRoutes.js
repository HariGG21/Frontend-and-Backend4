"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controller/productController");
const router = express_1.default.Router();
router.post("/create", productController_1.upload.array("images", 2), productController_1.createProduct);
router.get("/", productController_1.getProducts);
router.put("/:id", productController_1.upload.array("images", 1), productController_1.updateProduct);
router.delete("/delete", productController_1.deleteProduct);
router.post("/filter/name", productController_1.getProductsByName);
router.post("/filter/createdAt", productController_1.getProductsByCreatedAt);
router.post("/filter/stock", productController_1.getProductsByStock);
exports.default = router;
