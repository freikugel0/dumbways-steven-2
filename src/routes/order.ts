import express, { type Router } from "express";
import { getOrdersSummary } from "../controllers/order.js";

const router: Router = express.Router();

router.get("/orders/summary", getOrdersSummary);

export default router;
