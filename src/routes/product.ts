import express, { type Router } from "express";
import {
  createProduct,
  deleteProduct,
  detailProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.js";

const router: Router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", detailProduct);
router.post("/products", createProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);

export default router;
