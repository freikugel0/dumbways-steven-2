import express, { type Router } from "express";
import { supplierStock, getStocks } from "../controllers/stock.js";

const router: Router = express.Router();

router.get("/supplier/products", getStocks);
router.post("/supplier/stock", supplierStock);

export default router;
