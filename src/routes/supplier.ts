import express, { type Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
} from "../controllers/supplier.js";
import {
  authorize,
  authorizeSupplier,
  requireAuth,
} from "../middlewares/authz.js";

const router: Router = express.Router();

router.get(
  "/products",
  requireAuth,
  authorize(["ADMIN", "SUPPLIER"]),
  getProducts,
);
router.post(
  "/products",
  requireAuth,
  authorize(["ADMIN", "SUPPLIER"]),
  createProduct,
);
router.put(
  "/products/:productId",
  requireAuth,
  authorize(["ADMIN", "SUPPLIER"]),
  authorizeSupplier,
  updateProduct,
);

export default router;
