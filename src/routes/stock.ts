import express, { type Router } from "express";
import { supplierStock, getStocks } from "../controllers/stock.js";

const router: Router = express.Router();

router.get("/supplier/stocks", getStocks);
router.post("/supplier/stocks", supplierStock);

export default router;
